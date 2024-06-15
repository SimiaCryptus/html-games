import React from 'react';

interface MoveLogModalProps {
    moveLog: string[];
    onClose: () => void;
}

const MoveLogModal: React.FC<MoveLogModalProps> = ({moveLog, onClose}) => {
    return (
        <div className="modal" id="move-log-modal">
            <div className="modal-content">
                <span className="close-move-log" onClick={onClose}>&times;</span>
                <h3>Move Log</h3>
                <div id="move-log">
                    {moveLog.map((move, index) => (
                        <div key={index}>{index + 1}. {move}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MoveLogModal;
