'use client';

import React from 'react';
import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';
import {useDate} from "@/hooks/useDate";
import {useProcessContext} from "@/context/ProcessContext";

const PageCaptureButton: React.FC = () => {
    const {processId} = useProcessContext();
    const currentDate = useDate();
    const handleCapturePage = async () => {
        try {
            const content = document.getElementById('content');
            if (!content) {
                console.error('캡처할 콘텐츠를 찾을 수 없습니다.');
                return;
            }

            // dom-to-image로 콘텐츠 캡처
            const dataUrl = await domtoimage.toPng(content, {
                quality: 1,
                bgcolor: '#FFFFFF', // 배경색 설정
            });

            const pdf = new jsPDF('p', 'mm', 'a4');

            // PDF 페이지 크기
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // 이미지 객체 생성
            const img = new Image();
            img.src = dataUrl;

            img.onload = () => {
                // 이미지 크기를 PDF 너비의 67%로 설정하고 비율 유지
                const imgWidth = pdfWidth * 0.67;
                const imgHeight = (img.height * imgWidth) / img.width;

                // 이미지가 PDF 페이지에 맞게 중앙에 위치하도록 추가
                const xOffset = (pdfWidth - imgWidth) / 2;
                const yOffset = (pdfHeight - imgHeight) / 2;

                pdf.addImage(img, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
                pdf.save(`processID : ${processId} _${currentDate}.pdf`);
            };
        } catch (error) {
            console.error('PDF 생성 중 오류 발생:', error);
        }
    };

    return (
        <div className="flex justify-center mt-8">
            <button
                onClick={handleCapturePage}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                PDF로 저장
            </button>
        </div>
    );
};

export default PageCaptureButton;
