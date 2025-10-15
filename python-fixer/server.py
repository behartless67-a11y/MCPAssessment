"""
Flask server for UVA Document Fixer
"""

from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import tempfile
from document_fixer import fix_document
from text_to_docx import create_document_from_text

app = Flask(__name__, static_folder='static')
CORS(app)

UPLOAD_FOLDER = tempfile.gettempdir()
OUTPUT_FOLDER = 'output'
ALLOWED_EXTENSIONS = {'docx', 'pdf'}

os.makedirs(OUTPUT_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return send_file('static/index.html')

@app.route('/api/fix-document', methods=['POST'])
def fix_document_api():
    # Check if it's JSON text input (highest priority)
    if request.is_json:
        data = request.get_json()
        text_content = data.get('text')

        if not text_content:
            return jsonify({'error': 'No text provided'}), 400

        try:
            result = create_document_from_text(text_content, OUTPUT_FOLDER)

            fixed_filename = os.path.basename(result['fixed_document'])
            log_filename = os.path.basename(result['change_log'])

            return jsonify({
                'success': True,
                'message': 'Document created successfully!',
                'fixedDocument': f'/output/{fixed_filename}',
                'changeLog': f'/output/{log_filename}',
                'summary': result['summary'],
                'corrections': result['fixes'],
            })

        except Exception as e:
            return jsonify({'error': str(e)}), 500

    # Handle file upload
    if 'document' not in request.files:
        return jsonify({'error': 'No file or text uploaded'}), 400

    file = request.files['document']

    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': 'Only DOCX and PDF files supported'}), 400

    # Save uploaded file
    filename = secure_filename(file.filename)
    temp_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(temp_path)

    try:
        # Fix the document (automatically handles PDF conversion if needed)
        result = fix_document(temp_path, OUTPUT_FOLDER)

        # Get just the filenames for the response
        fixed_filename = os.path.basename(result['fixed_document'])
        log_filename = os.path.basename(result['change_log'])

        return jsonify({
            'success': True,
            'message': 'Document fixed successfully!',
            'fixedDocument': f'/output/{fixed_filename}',
            'changeLog': f'/output/{log_filename}',
            'summary': result['summary'],
            'corrections': result['fixes'],
        })

    except Exception as e:
        import traceback
        print(f"\n!!! ERROR fixing document: {e}")
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

    finally:
        # Clean up temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.route('/output/<path:filename>')
def download_file(filename):
    return send_from_directory(OUTPUT_FOLDER, filename, as_attachment=True)

if __name__ == '__main__':
    print("\n>>> UVA Document Fixer (Python) running!")
    print("\n>>> Open in browser: http://localhost:8080")
    print("\n>>> Ready to fix documents!\n")
    app.run(debug=False, port=8080)
