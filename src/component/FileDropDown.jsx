import { useState } from "react";
import { fnFileSize } from 'common/js/function';

function FileDropDown({
    serverFiles,           // 기존 저장된 파일 (정상)
    newFiles,              // 새로 추가한 파일 (대기)
    onChangeFiles,         // newFiles를 변경할 때 사용하는 setter
    onRemoveServerFile,    // 기존 파일 삭제 콜백
    onRemoveNewFile        // 새 파일 삭제 콜백
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

    const [dragging, setDragging] = useState(false);

    // allowed types
    const blockedExt = ['exe', 'bat', 'sh', 'java', 'jsp', 'asp', 'aspx', 'php', 'html', 'js', 'css', 'xml'];
    // 개별 파일 업로드 최대 용량 (MB)
    const MAX_FILE_SIZE_MB = 500;
    // 드래그 후
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

    // 드래그가 영역 밖으로 나간 상태
    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragging(false); // UI 원래 상태로 복구
    };

    // newFiles에 파일을 추가하기 전에 검사하는 로직
    const addFiles = (fileList) => {

        const arr = Array.from(fileList);

        const addedFiles = [];

        for (let i = 0; i < arr.length; i++) {
            const file = arr[i];
            const fileName = file.name;

            // 1) 파일명에서 확장자 추출
            const parts = fileName.split(".");
            const ext = parts[parts.length - 1].toLowerCase();

            // 2) 확장자 금지 검사
            if (blockedExt.includes(ext)) {
                alert(
                    `업로드 할 수 없는 확장자 입니다.\n\n[${ext}]\n\n이미지, 문서, 압축파일을 업로드해 주세요.`
                );
                continue;
            }

            // 3) 파일 사이즈 검사
            const fileSizeMB = file.size / 1024 / 1024;
            if (fileSizeMB > MAX_FILE_SIZE_MB) {
                alert(
                    `파일 업로드 최대 용량 ${MAX_FILE_SIZE_MB}MB 초과\n(${fileSizeMB.toFixed(
                        2
                    )}MB)`
                );
                continue;
            }

            // 4) 위 조건을 모두 통과한 안전한 파일만 push
            addedFiles.push(file);
        }

        // 5) 기존 newFiles와 합쳐서 반영
        if (addedFiles.length > 0) {
            onChangeFiles([...newFiles, ...addedFiles]);
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
                backgroundImage: serverFiles.length === 0 && newFiles.length === 0 ? "url(/images/filedropdown/file_drag_bg.png)" : "none",
                backgroundColor: dragging ? "#eeeef7" : "white"   // 드래그 상태에 따라 동적 변경
            }}
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
                    {/* 서버에 저장된 기존 파일 (정상) */}
                    {serverFiles.map((f) => (
                        <tr key={f.file_IDX}>
                            <td>
                                <a href={`/common/filedownload?fpt=${f.file_PATH}&fnm=${f.file_NM}&rfnm=${f.real_FILE_NM}`}>
                                    {f.real_FILE_NM}
                                </a>
                            </td>
                            <td>{fnFileSize(f.file_SIZE)}</td>
                            <td>정상</td>
                            <td>
                                <a href="#filedel" class="ry_btnFileDel" onClick={() => onRemoveServerFile(f)}>
                                    <img src="/images/filedropdown/btn_rowdel.png" alt="삭제" />
                                </a>
                            </td>
                        </tr>
                    ))}

                    {/* 새로 추가된 파일 (대기 상태) */}
                    {newFiles.map((file, idx) => (
                        <tr key={idx} style={{ background: "#eef7ff" }}>
                            <td>{file.name}</td>
                            <td>{fnFileSize(file.size)}</td>
                            <td>대기</td>
                            <td>
                                <a href="#filedel" class="ry_btnFileDel" onClick={() => onRemoveNewFile(idx)}>
                                    <img src="/images/filedropdown/btn_rowdel.png" alt="삭제" />
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}

export default FileDropDown;