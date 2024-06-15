import React, {useState} from 'react';

interface SaveLoadModalProps {
    onImportLayout: (layout: string) => void;
    onExportLayout: () => string;
    onClose: () => void;
}

const SaveLoadModal: React.FC<SaveLoadModalProps> = ({onImportLayout, onExportLayout, onClose}) => {
    const [layoutText, setLayoutText] = useState('');

    const handleImportLayout = () => {
        onImportLayout(layoutText);
    };

    const handleExportLayout = () => {
        setLayoutText(onExportLayout());
    };

    return (
        <div className="modal" id="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <textarea
                    id="board-layout"
                    rows={8}
                    cols={50}
                    placeholder="Paste board layout here to import or copy to export"
                    value={layoutText}
                    onChange={(e) => setLayoutText(e.target.value)}
                />
                <button id="import-layout" onClick={handleImportLayout}>Import Layout</button>
                <button id="export-layout" onClick={handleExportLayout}>Export Layout</button>
            </div>
        </div>
    );
};

export default SaveLoadModal;
