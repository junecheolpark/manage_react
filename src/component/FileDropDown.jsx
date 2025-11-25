import { useState, useRef } from "react";

function formatFileSize(bytes) {
    if (bytes >= 1024 ** 3) return (bytes / 1024 ** 3).toFixed(2) + " GB";
    if (bytes >= 1024 ** 2) return (bytes / 1024 ** 2).toFixed(2) + " MB";
    if (bytes >= 1024) return (bytes / 1024).toFixed(2) + " KB";
    return bytes + " Byte";
}

function FileDropDown({ folder = "uploadfile", maxSizeMB = 500 }) {
    const style = {
        dragArea: {
            width: "100%",
            border: "2px dashed #ccc",
            cursor: "pointer",
            background: "url(/images/filedropdown/file_drag_bg.png) no-repeat center center",
            maxHeight: "200px",
        },

        delBtn: {
            background: "#ff4d4d",
            border: "none",
            cursor: "pointer",
            color: "white",
            borderRadius: "50%",
            width: "27px",
            height: "27px",
            fontSize: "18px",
            fontWeight: "bold",
        },

        bottomArea: {
            padding: "10px",
            textAlign: "right",
        },

        uploadBtn: {
            marginLeft: "10px",
            padding: "5px 12px",
            background: "#0077cc",
            border: "none",
            color: "white",
        }
    };
    const [fileList, setFileList] = useState([]);
    const [totalSize, setTotalSize] = useState(0);
    const fileInputRef = useRef(null);

    // allowed types
    const blockedExt = ['exe', 'bat', 'sh', 'java', 'jsp', 'asp', 'aspx', 'php', 'html', 'js', 'css', 'xml'];

    const handleDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        addFiles(files);
    };

    const handleFileSelect = (e) => {
        addFiles(e.target.files);
    };

    const addFiles = (files) => {
        let newFiles = [];
        let newTotalSize = totalSize;

        for (let file of files) {
            const ext = file.name.split('.').pop().toLowerCase();
            const sizeMB = file.size / 1024 / 1024;

            if (blockedExt.includes(ext)) {
                alert("업로드 불가능한 파일입니다.");
                continue;
            }

            if (sizeMB > maxSizeMB) {
                alert(`파일 용량 초과. (${maxSizeMB}MB 제한)`);
                continue;
            }

            newTotalSize += sizeMB;

            newFiles.push({
                file,
                name: file.name,
                size: file.size,
                sizeText: formatFileSize(file.size),
                status: "대기",
            });
        }

        setTotalSize(newTotalSize);
        setFileList((prev) => [...prev, ...newFiles]);
    };

    const removeFile = (index) => {
        const removed = fileList[index];
        setTotalSize((prev) => prev - removed.size / 1024 / 1024);
        setFileList((prev) => prev.filter((_, i) => i !== index));
    };

    const uploadFiles = async () => {
        if (fileList.length === 0) return;

        const formData = new FormData();
        fileList.forEach((f) => {
            formData.append("uploadFiles", f.file);
        });
        formData.append("utype", "multi");
        formData.append("ufolder", folder);

        try {
            const res = await fetch("/common/fileupload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            console.log(data);

            alert("업로드 완료");

        } catch (err) {
            console.error(err);
            alert("업로드 실패");
        }
    };

    return (
        <div
            className={`${style.dragArea} DivScrollY`}
            id="fileDragBody"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current.click()}
        >
            <table className="tableList">
                <thead>
                    <tr>
                        <th>파일명</th>
                        <th>용량</th>
                        <th>상태</th>
                        <th>삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {fileList.length === 0 ? (
                        <tr>
                            <td colSpan="4" style={{ textAlign: "center", padding: "30px" }}>
                                <span style={{ color: "#0077cc" }}>파일 추가</span> 또는 드래그 하세요.
                            </td>
                        </tr>
                    ) : (
                        fileList.map((item, i) => (
                            <tr key={i}>
                                <td>{item.name}</td>
                                <td>{item.sizeText}</td>
                                <td>{item.status}</td>
                                <td>
                                    <button className={style.delBtn} onClick={() => removeFile(i)}>
                                        -
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <input
                type="file"
                multiple
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileSelect}
            />

            {/* <div className={style.bottomArea}>
                총 용량: {totalSize.toFixed(2)}MB / 제한 {maxSizeMB}MB
                <button onClick={uploadFiles} className={style.uploadBtn}>업로드</button>
            </div> */}
        </div>
    );
}

export default FileDropDown;