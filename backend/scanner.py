import subprocess
import re

def is_valid_target(target):
    # Basic validation for domain or IPv4
    # Domain: a-z, 0-9, hyphens, periods
    # IPv4: digits and periods
    if re.match(r'^[a-zA-Z0-9.-]+$', target):
        return True
    return False

def run_reconnaissance(target):
    if not is_valid_target(target):
        raise ValueError("Invalid target format. Please provide a valid domain or IPv4 address.")
        
    # Execute nmap
    # nmap -sV target
    nmap_ports = []
    nmap_services = []
    try:
        nmap_process = subprocess.run(['nmap', '-sV', target], capture_output=True, text=True, timeout=120)
        output = nmap_process.stdout
        # Parse nmap output
        for line in output.split('\n'):
            match = re.match(r'^(\d+)/(tcp|udp)\s+open\s+(\S+)\s+(.*)', line)
            if match:
                port = int(match.group(1))
                proto = match.group(2)
                service = match.group(3)
                version = match.group(4).strip()
                
                nmap_ports.append(port)
                nmap_services.append({
                    'port': port,
                    'protocol': proto,
                    'service': service,
                    'version': version
                })
    except Exception as e:
        print(f"Nmap execution error: {e}")
        
    # Execute curl for headers
    headers = {}
    try:
        # Use http:// prefix if target doesn't have it
        target_url = target if target.startswith('http') else f"http://{target}"
        curl_process = subprocess.run(['curl', '-I', '-s', '-L', target_url], capture_output=True, text=True, timeout=30)
        output = curl_process.stdout
        
        # Parse headers
        for line in output.split('\n'):
            line = line.strip()
            if ':' in line:
                key, value = line.split(':', 1)
                headers[key.strip().lower()] = value.strip()
    except Exception as e:
        print(f"Curl execution error: {e}")
        
    return {
        'ports': nmap_ports,
        'services': nmap_services,
        'headers': headers
    }
