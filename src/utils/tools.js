// 将网络图片地址转换为File对象
import axios from 'axios'

async function imageUrlToFile(url, fileName) {
  try {
    // 第一步：使用axios获取网络图片数据
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const imageData = response.data

    // 第二步：将图片数据转换为Blob对象
    const blob = new Blob([imageData], {
      type: response.headers['content-type']
    })

    // 第三步：创建一个新的File对象
    let file = new File([blob], fileName, { type: blob.type })
    console.log('file:', file)
    return file
  } catch (error) {
    console.error('将图片转换为File对象时发生错误:', error)
    throw error
  }
}

function isVisitDateExpired(state, date_str) {
  if (state == 0) {
    let date1 = new Date(date_str.split(' ')[0])
    let today = new Date()
    today.setHours(0)
    today.setMinutes(0)
    today.setSeconds(0)
    return date1 < today
  }
  return false
}
export { imageUrlToFile, isVisitDateExpired }
