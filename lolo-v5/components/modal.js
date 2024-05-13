import ModalStyles from '../styles/Modal.module.css'
import { useState, useRef, useEffect } from 'react'

export default function Modal({ isOpen, children, onClose }) {
    const [modalOpen, setModalOpen] = useState(false);
    const modalRef = useRef(null);

    useEffect(() => {
        if (!modalOpen) return; function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setModalOpen(false);
                onClose();
            };
        }
        function handleKeyPress(event) {
            if (event.key === "Escape") {
                setModalOpen(false);
                onClose();
            }
        }
        window.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [modalOpen]);

    useEffect(() => { setModalOpen(isOpen) }, [isOpen]);

    return (
        modalOpen && (
            <div className={ModalStyles.modalBg}>
                <div className={ModalStyles.modal}>
                    <div ref={modalRef} className={ModalStyles.modalBox}>
                        {children}
                    </div>
                </div>
            </div>
        )
    )
}