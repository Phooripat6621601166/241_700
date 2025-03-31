const BASE_URL = 'http://localhost:8000'

window.onload = async () => {
    await loadData()
} 
const loadData = async() => {
    console.log('user page loaded');
    //1.LOAD User ทั้งหมด  จาก api ที่เตรียมไว้
    const response = await axios.get(`${BASE_URL}'/users'`);
 
    console.log(response.data)
 
    const userDOM = document.getElementById('users')
 
    //2.นำuser ทั้งหมดโหลดกลับเข้าไปใน html
    let htmlData = '<div>'
    for (let i = 0; i < response.data.length; i++) {
     let user = response.data[i];
     htmlData += `<div>
     ${user.id}${user.firstName}${user.lastName}
        <a href= 'index.html?id=${user.id}<button>Edit</button></a>
        <button class='delete' data-id='${user.id}'>Delete</button>
        </div>`
    }
     htmlData += '</div>'
     userDOM.innerHTML = htmlData
 
     //3. ลบuser
     const deleteDOMs = document.getElementByClassName('.delete')
     for (let i = 0; i < deleteDOMs.length; i++) {
         deleteDOMs[i].addEventListener('click', async (event) => {
             //ดึง id ของ user ที่ต้องการลบ
             const id = event.target.dataset.id
             try{
                 await axios.delete(`${BASE_URL}/users/${id}`)
                 loadData() //recursive function = เรียกใช้ฟังก์ชันเอง
             } catch (error) {
                 console.log('error',error)
             }
             
         })
     }
 }//
