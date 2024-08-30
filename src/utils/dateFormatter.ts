// 时间格式统一：yyyy-mm-dd
function dateFormatter (date: Date) {
    const year = date.getFullYear(); // 获取年份
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 获取月份，注意月份是从0开始，所以需要+1
    const day = String(date.getDate()).padStart(2, '0'); // 获取日期
    const formattedDate = `${year}-${month}-${day}`; // 格式化为 yyyy-mm-dd
    return formattedDate;
}

export default dateFormatter;