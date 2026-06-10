from flask import Flask, request, jsonify
from flask_cors import CORS
from scanner import run_reconnaissance
from analyzer import analyze_results
from storage import save_report, get_all_reports, get_report

app = Flask(__name__)
CORS(app) # Enable CORS for all routes (since we're running locally/frontend might be on a different port)

@app.route('/api/scan', methods=['POST'])
def scan():
    data = request.json
    if not data or 'target' not in data:
        return jsonify({'error': 'Target is required'}), 400
        
    target = data['target']
    
    # 1. Reconnaissance (nmap and curl)
    try:
        recon_data = run_reconnaissance(target)
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f"Reconnaissance failed: {str(e)}"}), 500

    # 2. Security Analysis
    analysis_results = analyze_results(recon_data)
    
    # Compile final report data
    report_data = {
        'target': target,
        'ports': recon_data['ports'],
        'services': recon_data['services'],
        'headers': recon_data['headers'],
        'findings': analysis_results['findings'],
        'riskLevel': analysis_results['riskLevel']
    }
    
    # 3. Storage
    try:
        save_report(report_data)
    except Exception as e:
        print(f"Error saving report: {e}")
        # Continue even if save fails, though in production we might want to alert
        pass
        
    return jsonify(report_data), 200

@app.route('/api/reports', methods=['GET'])
def list_reports():
    reports = get_all_reports()
    return jsonify(reports), 200

@app.route('/api/report/<filename>', methods=['GET'])
def get_single_report(filename):
    report_content = get_report(filename)
    if report_content is None:
        return jsonify({'error': 'Report not found'}), 404
    return jsonify({'content': report_content}), 200

if __name__ == '__main__':
    # Start the server
    app.run(host='0.0.0.0', port=5000, debug=True)
