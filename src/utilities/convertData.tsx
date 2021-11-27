export const convertStatus = (value: string) => {
    if (!value) return "";
    if (value == "Created") return "Đang chờ duyệt"
    if (value == "Approved") return  "Đã duyệt"
    if (value == "Rejected") return "Đã từ chối duyệt"

}
export const convertStatusColor = (value: string) => {
    if (!value) return "";
    if (value == "Created") return 'blue'
    if (value == "Approved") return 'green'
    if (value == "Rejected") return  'red'

}