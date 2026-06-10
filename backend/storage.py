import os
import json
from datetime import datetime

# Base directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
REPORTS_DIR = os.path.join(BASE_DIR, 'reports')
LOGS_DIR = os.path.join(BASE_DIR, 'logs')
SCANS_DIR = os.path.join(BASE_DIR, 'scans')

# Ensure directories exist
for directory in [REPORTS_DIR, LOGS_DIR, SCANS_DIR]:
    if not os.path.exists(directory):
        os.makedirs(directory)

def log_activity(target, status):
    log_file = os.path.join(LOGS_DIR, 'activity.log')
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    log_entry = f"[{timestamp}] Target: {target} | Status: {status}\n"
    
    with open(log_file, 'a', encoding='utf-8') as f:
        f.write(log_entry)

def save_report(report_data):
    target = report_data['target']
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f"{timestamp}_report.txt"
    filepath = os.path.join(REPORTS_DIR, filename)
    
    # Text format generation
    content = f"SECURITY SCAN REPORT\n"
    content += f"====================\n"
    content += f"Target: {target}\n"
    content += f"Scan Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
    content += f"Risk Level: {report_data['riskLevel']}\n\n"
    
    content += f"OPEN PORTS & SERVICES\n"
    content += f"---------------------\n"
    for service in report_data['services']:
        content += f"Port: {service['port']}/{service['protocol']} | Service: {service['service']} | Version: {service['version']}\n"
    content += "\n"
    
    content += f"HTTP HEADERS\n"
    content += f"------------\n"
    for k, v in report_data['headers'].items():
        content += f"{k}: {v}\n"
    content += "\n"
    
    content += f"SECURITY FINDINGS\n"
    content += f"-----------------\n"
    for finding in report_data['findings']:
        content += f"[{finding['severity']}] {finding['title']}: {finding['description']}\n"
    content += "\n"
    
    content += f"RECOMMENDATIONS\n"
    content += f"---------------\n"
    if report_data['riskLevel'] == 'High':
        content += "- Immediate action required. Address High severity findings immediately.\n"
    elif report_data['riskLevel'] == 'Medium':
        content += "- Plan mitigation for Medium severity findings in the next patch cycle.\n"
    else:
        content += "- Monitor continuously and apply defense-in-depth strategies.\n"
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    # Also save as JSON for easy parsing by frontend if needed in scans dir
    json_filepath = os.path.join(SCANS_DIR, f"{timestamp}_scan.json")
    with open(json_filepath, 'w', encoding='utf-8') as f:
        json.dump(report_data, f, indent=4)
        
    log_activity(target, "SUCCESS")
    return filename

def get_all_reports():
    reports = []
    if os.path.exists(REPORTS_DIR):
        for filename in sorted(os.listdir(REPORTS_DIR), reverse=True):
            if filename.endswith('_report.txt'):
                filepath = os.path.join(REPORTS_DIR, filename)
                # Parse basic info from filename (YYYYMMDD_HHMMSS_report.txt)
                parts = filename.split('_')
                if len(parts) >= 3:
                    date_str = f"{parts[0][:4]}-{parts[0][4:6]}-{parts[0][6:]}"
                    time_str = f"{parts[1][:2]}:{parts[1][2:4]}:{parts[1][4:]}"
                    reports.append({
                        'filename': filename,
                        'date': date_str,
                        'time': time_str,
                        'size': os.path.getsize(filepath)
                    })
    return reports

def get_report(filename):
    filepath = os.path.join(REPORTS_DIR, filename)
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    return None
