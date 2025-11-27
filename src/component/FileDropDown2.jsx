import { useState, useRef } from "react";

function FileDropDown({
    folder = "uploadfile",
    maxSizeMB = 500,
    files,              // 기존 DB 파일목록
    onChangeFiles, 
    onRemoveFile
}) {

    const style = {
        dragArea: {
            width: "100%",
            border: "2px dashed #ccc",
            cursor: "pointer",
            background: "url(/images/filedropdown/file_drag_bg.png) no-repeat center center",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
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
    const [dragging, setDragging] = useState(false);
    const fileInputRef = useRef(null);

    // allowed types
    const blockedExt = ['exe', 'bat', 'sh', 'java', 'jsp', 'asp', 'aspx', 'php', 'html', 'js', 'css', 'xml'];

    const formatSize = (bytes) => {
        if (bytes >= 1024 ** 3) return (bytes / 1024 ** 3).toFixed(2) + " GB";
        if (bytes >= 1024 ** 2) return (bytes / 1024 ** 2).toFixed(2) + " MB";
        if (bytes >= 1024) return (bytes / 1024).toFixed(2) + " KB";
        return bytes + " Byte";
    }

    const handleDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        addFiles(files);
        setDragging(false); // UI 원래 상태로 복구
    };

    // 드래그 영역 위에 파일이 올라온 상태
    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true); // border 색 변경 등 UI 변경 트리거
    };

    const handleSelect = (e) => {
        addFiles(e.target.files);
    };

    // 드래그가 영역 밖으로 나간 상태
    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragging(false); // UI 원래 상태로 복구
    };

    // 파일 추가 처리 (드래그 or input 선택)
    const addFiles = (files) => {
        let newFiles = [];
        let newTotalSize = totalSize;

        for (let file of files) {
            const ext = file.name.split('.').pop().toLowerCase();
            const sizeMB = file.size / 1024 / 1024;

            // 업로드 금지 확장자 체크
            if (blockedExt.includes(ext)) {
                alert("업로드 불가능한 파일입니다.");
                continue;
            }

            // 단일 파일의 최대 허용 크기 체크
            if (sizeMB > maxSizeMB) {
                alert(`파일 용량 초과. (${maxSizeMB}MB 제한)`);
                continue;
            }

            // 전체 파일 사이즈 누적
            newTotalSize += sizeMB;

            // UI 목록에 추가할 파일 데이터 생성
            newFiles.push({
                file,           // 실제 File 객체
                name: file.name,
                size: file.size,
                sizeText: formatSize(file.size), // 표시용 용량텍스트
                status: "대기", // 현재 상태
            });
        }

        // 총 용량 상태 업데이트
        setTotalSize(newTotalSize);
        // 파일 리스트 상태에 추가
        setFileList((prev) => [...prev, ...newFiles]);
    };


    // 목록에서 파일 삭제
    const removeFile = (index) => {
        const removed = fileList[index];
        // 전체 용량에서 제거된 파일 용량 차감
        setTotalSize((prev) => prev - removed.size / 1024 / 1024);

        // 목록에서 제외
        setFileList((prev) => prev.filter((_, i) => i !== index));
    };


    // 서버로 파일 업로드 요청
    const uploadFiles = async () => {
        // 업로드할 파일이 없으면 종료
        if (fileList.length === 0) return;

        const formData = new FormData();

        // FormData에 실제 파일 데이터 삽입
        fileList.forEach((f) => {
            formData.append("uploadFiles", f.file);
        });

        // 서버에서 요구하는 추가 파라미터
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
            className="DivScrollY"
            id="fileDragBody"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            style={{
                ...style.dragArea,                 // 기존 스타일 유지
                backgroundImage: fileList.length === 0 ? "url(/images/filedropdown/file_drag_bg.png)" : "none",
                backgroundColor: dragging ? "#eeeef7" : "white"   // 드래그 상태에 따라 동적 변경
            }}
        // onClick={() => fileInputRef.current.click()}
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
                        <></>
                        // <tr>
                        //     <td colSpan="4" style={{ textAlign: "center", padding: "30px" }}>
                        //         <span style={{ color: "#0077cc" }}>파일 추가</span> 또는 드래그 하세요.
                        //     </td>
                        // </tr>
                    ) : (
                        fileList.map((item, i) => (
                            <tr key={i}>
                                <td>{item.name}</td>
                                <td>{item.sizeText}</td>
                                <td>{item.status}</td>
                                <td>
                                    <button style={style.delBtn} onClick={() => removeFile(i)}>
                                        -
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* <input
                type="file"
                multiple
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleSelect 
            /> */}

            {/* <div style={style.bottomArea}>
                총 용량: {totalSize.toFixed(2)}MB / 제한 {maxSizeMB}MB
                <button onClick={uploadFiles} style={style.uploadBtn}>업로드</button>
            </div> */}
        </div>
    );
}

export default FileDropDown;