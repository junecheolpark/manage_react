import React, { useState, useCallback } from "react";

export default function FileDropDown({ 
    files,              // 기존 DB 파일목록
    onAddFiles,         // 새로 추가된 파일 전달
    onDeleteFile        // 삭제 버튼 클릭 이벤트 전달
}) {

    const [dragging, setDragging] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);

        const newFiles = Array.from(e.dataTransfer.files);

        if (newFiles.length === 0) return;

        onAddFiles(newFiles);
    };

    const handleFileSelect = (e) => {
        const newFiles = Array.from(e.target.files);
        if (newFiles.length === 0) return;
        onAddFiles(newFiles);
    };

    const formatSize = (sizeByte) => {
        if (sizeByte >= 1024 ** 3) return (sizeByte / 1024 ** 3).toFixed(1) + " GB";
        if (sizeByte >= 1024 ** 2) return (sizeByte / 1024 ** 2).toFixed(1) + " MB";
        if (sizeByte >= 1024) return (sizeByte / 1024).toFixed(1) + " KB";
        return sizeByte + " Byte";
    };

    return (
        <div>

            {/* 드래그 영역 */}
            <div
                style={{
                    width: "100%",
                    border: "2px dashed #ccc",
                    cursor: "pointer",
                    maxHeight: "200px",
                    backgroundImage: "url(/images/filedropdown/file_drag_bg.png)",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundColor: dragging ? "#eeeef7" : "white"
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    style={{ display: "none" }}
                    id="fileInput"
                />
                <label htmlFor="fileInput" style={{ display: "block", height: "200px" }}></label>
            </div>

            {/* 파일 목록 표시 */}
            <div style={{ maxHeight: "200px", overflowY: "auto", marginTop: "12px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th style={{ width: "55%" }}>파일명</th>
                            <th style={{ width: "15%" }}>용량</th>
                            <th style={{ width: "15%" }}>상태</th>
                            <th style={{ width: "15%" }}>삭제</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.map((file, i) => (
                            <tr key={i}>
                                <td>{file.realName ?? file.name}</td>
                                <td>{formatSize(file.size)}</td>
                                <td>{file.status ?? "대기"}</td>
                                <td>
                                    <button
                                        onClick={() => onDeleteFile(file)}
                                        style={{
                                            background: "#ff4d4d",
                                            color: "white",
                                            border: "none",
                                            cursor: "pointer",
                                            borderRadius: "50%",
                                            width: "27px",
                                            height: "27px",
                                            fontSize: "18px",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        X
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}