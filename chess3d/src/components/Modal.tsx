import React, {memo, useCallback, useEffect, useRef} from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    modalId?: string;
}

const Modal: React.FC<ModalProps> = memo(({isOpen, onClose, children, modalId = 'default'}) => {
    const renderCount = useRef(0);

    console.log(`Modal ${modalId}: Component rendering. isOpen: ${isOpen}`);

    useEffect(() => {
        console.group(`Modal ${modalId}: useEffect`);
        console.log(`isOpen changed to: ${isOpen}`);
        if (isOpen) {
            console.time(`Modal ${modalId}: Open Duration`);
        } else {
            console.timeEnd(`Modal ${modalId}: Open Duration`);
        }
        console.groupEnd();

        return () => {
            console.log(`Modal ${modalId}: Cleanup effect`);
        };
    }, [isOpen, modalId]);

    const handleClose = useCallback(() => {
        console.warn(`Modal ${modalId}: Close button clicked`);
        onClose();
    }, [modalId, onClose]);

    const handleOverlayClick = useCallback(() => {
        console.warn(`Modal ${modalId}: Overlay clicked`);
        onClose();
    }, [modalId, onClose]);

    const handleContentClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        console.debug(`Modal ${modalId}: Content clicked, propagation stopped`);
    }, [modalId]);

    if (!isOpen) {
        console.log(`Modal ${modalId}: Not rendering (closed)`);
        return null;
    }

    renderCount.current += 1;
    console.log(`Modal ${modalId}: Rendering content (render count: ${renderCount.current})`);

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div
                className="modal-content"
                onClick={handleContentClick}
            >
                <button className="modal-close" onClick={handleClose}>
                    &times;
                </button>
                {console.log(`Modal ${modalId}: Rendering children`)}
                {children}
            </div>
        </div>
    );
});

console.info('Modal component defined');
export default Modal;