from ultralytics import YOLO
import cv2
import numpy as np
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class HelmetDetector:

    def __init__(
        self,
        model_path: str = "models/best_helmet.pt",
        conf_threshold: float = 0.7
    ):

        # =========================
        # MODELO YOLO
        # =========================
        self.model = YOLO(model_path)

        self.conf_threshold = conf_threshold

        # =========================
        # CLASSES
        # =========================
        # AJUSTE conforme model.names
        self.class_names = {
            0: 'helmet_lifted',
            1: 'with_helmet',
            2: 'without_helmet'}

        # =========================
        # DETECTOR FACIAL
        # =========================
        self.face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades +
            "haarcascade_frontalface_default.xml"
        )

    def detect(self, image: np.ndarray):

        # =========================
        # YOLO
        # =========================
        results = self.model.predict(
            source=image,
            conf=0.1,
            verbose=True
        )[0]

        detections = []

        violations = []

        # =========================
        # CONVERTE PARA GRAYSCALE
        # =========================
        gray = cv2.cvtColor(
            image,
            cv2.COLOR_BGR2GRAY
        )

        # =========================
        # DETECÇÃO FACIAL MELHORADA
        # =========================
        faces = self.face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.05,
            minNeighbors=7,
            minSize=(30, 30)
        )

        # =========================
        # VALIDAÇÃO DE ROSTO
        # =========================
        face_detected = False

        valid_faces = []

        for (x, y, w, h) in faces:

            # Ignora rostos muito pequenos
            if w > 60 and h > 60:

                face_detected = True

                valid_faces.append((x, y, w, h))

        # =========================
        # PROCESSA DETECÇÕES YOLO
        # =========================
        for box in results.boxes:

            x1, y1, x2, y2 = map(
                int,
                box.xyxy[0]
            )

            conf = float(box.conf[0])

            cls_id = int(box.cls[0])

            class_name = self.class_names.get(
                cls_id,
                f"classe_{cls_id}"
            )

            # ====================================
            # CORREÇÃO PRINCIPAL
            # ====================================

            # Se rosto visível,
            # força infração
            #if face_detected:

                #class_name = "without_helmet"

            detection = {
                "class": class_name,
                "confidence": round(conf, 4),
                "bbox": [x1, y1, x2, y2]
            }
            x1, y1, x2, y2 = map(
                int,
                box.xyxy[0]
            )

            # Ignora detecções pequenas
            area = (x2 - x1) * (y2 - y1)

            if area < 15000:
                continue
            detections.append(detection)

            # =========================
            # INFRAÇÕES
            # =========================
            if class_name in [
                "without_helmet",
                "helmet_lifted"
            ]:

                if class_name not in violations:

                    violations.append(class_name)

        # =========================
        # VIOLAÇÃO POR ROSTO
        # =========================
        if face_detected:

            if "face_visible" not in violations:

                violations.append("face_visible")

        # =========================
        # DEFINE STATUS
        # =========================
        if violations:

            status = "incorrect_use"

        elif any(
            d["class"] == "with_helmet"
            for d in detections
        ):

            status = "correct_use"

        else:

            status = "no_helmet_detected"

        # =========================
        # RETORNO
        # =========================
        return {
            "status": status,
            "violations": violations,
            "detections": detections,
            "faces": valid_faces,
            "num_faces": len(valid_faces),
            "num_detections": len(detections)
        }

    def draw_results(
        self,
        image: np.ndarray,
        result: dict
    ):

        img_copy = image.copy()

        # =========================
        # DETECÇÕES YOLO
        # =========================
        for det in result["detections"]:

            x1, y1, x2, y2 = det["bbox"]

            cls = det["class"]

            conf = det["confidence"]

            # =========================
            # CORES
            # =========================
            if cls == "with_helmet":

                color = (0, 255, 0)

            else:

                color = (0, 0, 255)

            # =========================
            # CAIXA
            # =========================
            cv2.rectangle(
                img_copy,
                (x1, y1),
                (x2, y2),
                color,
                3
            )

            # =========================
            # TEXTO
            # =========================
            label = f"{cls} {conf:.2f}"

            cv2.putText(
                img_copy,
                label,
                (x1, y1 - 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                color,
                2
            )

        # =========================
        # DESENHA ROSTOS
        # =========================
        for (x, y, w, h) in result["faces"]:

            cv2.rectangle(
                img_copy,
                (x, y),
                (x + w, y + h),
                (255, 0, 0),
                2
            )

            cv2.putText(
                img_copy,
                "FACE",
                (x, y - 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (255, 0, 0),
                2
            )

        # =========================
        # STATUS
        # =========================
        if result["status"] == "correct_use":

            status_color = (0, 255, 0)

        else:

            status_color = (0, 0, 255)

        cv2.putText(
            img_copy,
            f"STATUS: {result['status'].upper()}",
            (10, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.0,
            status_color,
            3
        )

        # =========================
        # VIOLAÇÕES
        # =========================
        if result["violations"]:

            violations_text = ", ".join(
                result["violations"]
            )

            cv2.putText(
                img_copy,
                f"VIOLATIONS: {violations_text}",
                (10, 80),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (0, 0, 255),
                2
            )

        return img_copy