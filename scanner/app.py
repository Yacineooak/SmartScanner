from flask import Flask, request, jsonify
import nmap
import json
from concurrent.futures import ThreadPoolExecutor
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
scanner = nmap.PortScanner()

@app.route('/scan/<scan_type>', methods=['POST'])
def scan(scan_type):
    data = request.json
    target = data.get('target')
    port_range = data.get('portRange', '1-1000')
    
    if scan_type == 'tcp':
        return scan_tcp(target, port_range)
    elif scan_type == 'udp':
        return scan_udp(target, port_range)
    elif scan_type == 'os':
        return detect_os(target)
    else:
        return jsonify({'error': 'Invalid scan type'}), 400

def scan_tcp(target, port_range):
    try:
        scanner.scan(target, port_range, '-sS -sV')
        results = []
        
        for host in scanner.all_hosts():
            for proto in scanner[host].all_protocols():
                ports = scanner[host][proto].keys()
                for port in ports:
                    service = scanner[host][proto][port]
                    results.append({
                        'port': port,
                        'state': service['state'],
                        'service': service['name'],
                        'version': service['version'],
                        'protocol': proto
                    })
        
        return jsonify(results)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def scan_udp(target, port_range):
    try:
        scanner.scan(target, port_range, '-sU')
        results = []
        
        for host in scanner.all_hosts():
            for proto in scanner[host].all_protocols():
                ports = scanner[host][proto].keys()
                for port in ports:
                    service = scanner[host][proto][port]
                    results.append({
                        'port': port,
                        'state': service['state'],
                        'service': service['name'],
                        'protocol': proto
                    })
        
        return jsonify(results)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def detect_os(target):
    try:
        scanner.scan(target, arguments='-O')
        os_matches = scanner[target].get('osmatch', [])
        
        if os_matches:
            return jsonify({
                'os': os_matches[0]['name'],
                'accuracy': os_matches[0]['accuracy'],
                'type': os_matches[0].get('osclass', [{}])[0].get('type', 'unknown')
            })
        
        return jsonify({'error': 'OS detection failed'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001)