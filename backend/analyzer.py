def analyze_results(recon_data):
    findings = []
    risk_score = 0
    
    # 1. Analyze Ports
    vulnerable_ports = {
        21: {'name': 'FTP', 'severity': 'High', 'desc': 'Unencrypted file transfer protocol exposed.'},
        22: {'name': 'SSH', 'severity': 'Low', 'desc': 'SSH port is open. Ensure strong passwords or key-based authentication is used.'},
        23: {'name': 'Telnet', 'severity': 'High', 'desc': 'Unencrypted remote management protocol exposed.'},
        80: {'name': 'HTTP', 'severity': 'Medium', 'desc': 'Unencrypted web traffic. Ensure redirect to HTTPS.'}
    }
    
    for port in recon_data['ports']:
        if port in vulnerable_ports:
            info = vulnerable_ports[port]
            findings.append({
                'title': f"Open Port: {port} ({info['name']})",
                'severity': info['severity'],
                'description': info['desc']
            })
            if info['severity'] == 'High':
                risk_score += 3
            elif info['severity'] == 'Medium':
                risk_score += 2
            else:
                risk_score += 1
                
    # 2. Analyze Headers
    headers = recon_data.get('headers', {})
    
    security_headers = {
        'strict-transport-security': {'name': 'HSTS', 'severity': 'Medium', 'desc': 'Missing HTTP Strict Transport Security header.'},
        'x-frame-options': {'name': 'X-Frame-Options', 'severity': 'Medium', 'desc': 'Missing X-Frame-Options header, vulnerable to clickjacking.'},
        'x-content-type-options': {'name': 'X-Content-Type-Options', 'severity': 'Low', 'desc': 'Missing X-Content-Type-Options header.'},
        'content-security-policy': {'name': 'Content-Security-Policy', 'severity': 'High', 'desc': 'Missing Content-Security-Policy header, susceptible to XSS.'}
    }
    
    for header_key, info in security_headers.items():
        if header_key not in headers:
            findings.append({
                'title': f"Missing Security Header: {info['name']}",
                'severity': info['severity'],
                'description': info['desc']
            })
            if info['severity'] == 'High':
                risk_score += 3
            elif info['severity'] == 'Medium':
                risk_score += 2
            else:
                risk_score += 1

    # Service Exposure
    if 'server' in headers:
        findings.append({
            'title': 'Server Banner Exposure',
            'severity': 'Low',
            'description': f"Server version exposed: {headers['server']}"
        })
        risk_score += 1

    # Calculate Risk Level
    if risk_score >= 8:
        risk_level = 'High'
    elif risk_score >= 4:
        risk_level = 'Medium'
    else:
        risk_level = 'Low'
        
    return {
        'findings': findings,
        'riskLevel': risk_level
    }
