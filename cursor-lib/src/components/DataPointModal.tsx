import React from 'react';
import Modal from 'react-modal';
import { Point } from '@/types';

interface DataPointModalProps {
    isModalOpen: boolean;
    currentPoint: Point | null;
    handleModalConfirm: () => void;
    handleModalCancel: () => void;
}

const DataPointModal: React.FC<DataPointModalProps> = ({
                                                           isModalOpen,
                                                           currentPoint,
                                                           handleModalConfirm,
                                                           handleModalCancel,
                                                       }) => {
    return (
        <Modal
            isOpen={isModalOpen}
            onRequestClose={handleModalCancel}
            contentLabel="Confirm Point Selection"
            className="bg-white p-6 rounded shadow-lg max-w-md mx-auto my-auto"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <h2 className="text-xl font-bold mb-4">데이터 포인트 선택</h2>
            {currentPoint && (
                <p className="mb-4">
                    선택한 데이터 포인트의 좌표: (X: {currentPoint.x}, Y: {currentPoint.y})
                </p>
            )}
            <div className="flex justify-end gap-4">
                <button
                    onClick={handleModalConfirm}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    선택
                </button>
                <button
                    onClick={handleModalCancel}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                    취소
                </button>
            </div>
        </Modal>
    );
};

export default DataPointModal;
