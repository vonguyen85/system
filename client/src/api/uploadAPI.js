import * as FileSaver from 'file-saver';
import writeXlsxFile from 'write-excel-file';
import { userRequest } from './requestMethod';
const upload = {
    docx: async (token, formData) => {
        const response = await userRequest.post("/upload/docx", formData, { headers: { 'content-type': 'multipart/form-data', token: token } });
        return response;
    },
    parse_docx: async (token, file_path) => {
        const response = await userRequest.get(`/upload/parse_docx?file=${file_path.filename}`, { headers: { 'content-type': 'multipart/form-data', token: token } });
        return response;
    },
    destroy: (token, data) => {
        userRequest.post("/upload/destroy", data, { headers: { token: token } });
    },

    xlsx: async (token, formData) => {
        const response = await userRequest.post("/upload/excel", formData, { headers: { 'content-type': 'multipart/form-data', token: token } });
        return response;
    },
    parse_excel: async (token, file_path, classId) => {
        const response = await userRequest.get(`/upload/parse_excel?file=${file_path.filename}&classId=${classId}`, { headers: { 'content-type': 'multipart/form-data', token: token } });
        return response;
    },
    exportExcel: async (student) => {
        try {
            // const student = data.map((item, index) => {
            //     return {stt: index + 1, name: item.name, time: item.time, mark: item.mark}
            // });
            const schema = [
                // Column #1
                {
                  column: 'STT',
                  type: Number,
                  width: 5,
                  borderStyle: 'thin',
                  value: student => student.stt
                },
                // Column #2
                {
                  column: 'Họ tên',
                  type: String,
                  borderStyle: 'thin',
                  width: 20,
                  value: student => student.name
                },
                // // Column #4
                {
                    column: 'Thời gian làm bài',
                    color: '#ff0000',
                    borderStyle: 'thin',
                    width: 20,
                    type: String,
                    value: student => student.time
                },
                {
                    column: 'Điểm',
                    borderStyle: 'thin',
                    width: 7,
                    type: Number,
                    value: student => student.mark,
                }
              ]

           const date = new Date();
            const file = await writeXlsxFile(student, {
                schema,
                headerStyle: {
                    backgroundColor: '#eeeeee',
                    fontWeight: 'bold',
                    align: 'center', 
                    borderStyle: 'thin'
                  },
                fileName: `ketquakiemtra_${date.getTime()}.xlsx`
            })
            FileSaver.saveAs(file);
        } catch (error) {
            console.log(error)
        }
    },
    loadFile: (filePath, filename) =>{
        FileSaver.saveAs(filePath, filename);
    }
}

export default upload;