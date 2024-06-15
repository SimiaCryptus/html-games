import React, {useState} from 'react';

interface TextMoveModalProps {
    onSubmitMove: (moveText: string) => void;
    onClose: () => void;
}

const TextMoveModal: React.FC<TextMoveModalProps> = ({onSubmitMove, onClose}) => {
    const [moveText, setMoveText] = useState('');

    const handleSubmitMove = () => {
        onSubmitMove(moveText);
        onClose();
    };

    return (
        <div className="modal" id="text-move-modal">
            <div className="modal-content">
                <span className="close-text-move" onClick={onClose}>&times;</span>
                <textarea
                    id="text-move-input"
                    rows={4}
                    cols={50}
                    placeholder="Enter move notation (e.g., e2e4)"
                    value={moveText}
                    onChange={(e) => setMoveText(e.target.value)}
                />
                <button id="submit-text-move" onClick={handleSubmitMove}>Submit Move</button>
            </div>
        </div>
    );
};

export default TextMoveModal;
