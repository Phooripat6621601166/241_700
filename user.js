const BASE_URL = 'http://localhost:8000';

window.onload = async () => {
    await loadData();
    showElements(); // เรียกฟังก์ชันแสดงผล
};

const loadData = async () => {
    console.log('user page onload');
    const userDOM = document.getElementById('user');
    userDOM.innerHTML = '<tr><td colspan="8" style="text-align:center;">Loading...</td></tr>'; // แสดงข้อความ Loading

    try {
        const response = await axios.get(`${BASE_URL}/users`);
        console.log(response.data);

        let htmlData = '';
        if (response.data.length === 0) {
            htmlData = '<tr><td colspan="8" style="text-align:center;">No users found.</td></tr>'; // แสดงข้อความเมื่อไม่มีข้อมูล
        } else {
            response.data.forEach(user => {
                htmlData += `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.firstname}</td>
                        <td>${user.lastname}</td>
                        <td>${user.age}</td>
                        <td>${user.gender}</td>
                        <td>${user.interests}</td>
                        <td>${user.description}</td>
                        <td>
                            <a href='index.html?id=${user.id}'><button class='edit'>Edit</button></a>
                            <button class='delete' data-id='${user.id}'>Delete</button>
                        </td>
                    </tr>
                `;
            });
        }
        userDOM.innerHTML = htmlData;
        attachDeleteListeners(); // เรียกฟังก์ชันแนบ listener ให้ปุ่ม Delete
    } catch (error) {
        console.error('Error loading data:', error);
        userDOM.innerHTML = '<tr><td colspan="8" style="text-align:center; color: red;">Error loading data.</td></tr>'; // แสดงข้อความ error
    }
};

const attachDeleteListeners = () => {
    const deleteDOM = document.getElementsByClassName('delete');
    for (let i = 0; i < deleteDOM.length; i++) {
        deleteDOM[i].addEventListener('click', async (event) => {
            const id = event.target.dataset.id;
            if (confirm(`Are you sure you want to delete user ID ${id}?`)) { // เพิ่ม confirm dialog
                try {
                    await axios.delete(`${BASE_URL}/users/${id}`);
                    loadData(); // เรียก loadData() เพื่อโหลดข้อมูลใหม่
                } catch (error) {
                    console.error('Error deleting user:', error);
                    alert('Failed to delete user.'); // แสดง alert เมื่อ delete ไม่สำเร็จ
                }
            }
        });
    }
};

const showElements = () => {
    const container = document.querySelector('.container');
    const header = document.querySelector('h2.header');
    container.classList.add('show');
    header.classList.add('show');
};