# camera_stream.py - Versão Otimizada (Menos Lag)
from flask import Flask, Response
import cv2
from helmet_detector import HelmetDetector
import time

app = Flask(__name__)

# ================== CONFIGURAÇÕES DE PERFORMANCE ==================
detector = HelmetDetector(model_path="models/best_helmet.pt", conf_threshold=0.45)

# Parâmetros para reduzir lag:
SKIP_FRAMES = 2          # Processa 1 a cada 2 frames (reduz carga)
FRAME_WIDTH = 640        # Reduz resolução (melhor performance)
FRAME_HEIGHT = 480
# ================================================================

frame_count = 0

def generate_frames():
    global frame_count
    cap = cv2.VideoCapture(0)

    # Configurações da câmera para melhor velocidade
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, FRAME_WIDTH)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, FRAME_HEIGHT)
    cap.set(cv2.CAP_PROP_FPS, 30)

    print("🎥 Stream iniciado - Modo Otimizado")

    while True:
        success, frame = cap.read()
        if not success:
            break

        frame_count += 1

        # Processa apenas alguns frames com YOLO (reduz lag)
        if frame_count % SKIP_FRAMES == 0:
            result = detector.detect(frame)
            frame = detector.draw_results(frame, result)

        # Converte para JPEG (qualidade balanceada)
        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 85]
        _, buffer = cv2.imencode('.jpg', frame, encode_param)
        frame_bytes = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

        # Pequeno delay para não sobrecarregar
        time.sleep(0.001)

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), 
                   mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    print("🚀 Servidor de stream otimizado rodando em http://localhost:5000")
    app.run(host="0.0.0.0", port=5000, debug=False, threaded=True)