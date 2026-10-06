// LocalStorage Keys
let debtsOnMe = JSON.parse(localStorage.getItem('debtsOnMe')) || [];
let debtsToOthers = JSON.parse(localStorage.getItem('debtsToOthers')) || [];

// DOM Elements
const debtOnMeForm = document.getElementById('debtOnMeForm');
const debtToOthersForm = document.getElementById('debtToOthersForm');

const debtOnMeTableBody = document.getElementById('debtOnMeTableBody');
const debtToOthersTableBody = document.getElementById('debtToOthersTableBody');

const emptyDebtOnMe = document.getElementById('emptyDebtOnMe');
const emptyDebtToOthers = document.getElementById('emptyDebtToOthers');

const totalOwedByMeEl = document.getElementById('totalOwedByMe');
const totalRemainingToPayEl = document.getElementById('totalRemainingToPay');
const totalLentToOthersEl = document.getElementById('totalLentToOthers');

// Render Function
function renderAll() {
    renderDebtsOnMe();
    renderDebtsToOthers();
    updateStats();
}

// 1. عرض ديون "علي"
function renderDebtsOnMe() {
    debtOnMeTableBody.innerHTML = '';
    if (debtsOnMe.length === 0) {
        emptyDebtOnMe.style.display = 'block';
    } else {
        emptyDebtOnMe.style.display = 'none';
        debtsOnMe.forEach((item, index) => {
            const total = parseFloat(item.total) || 0;
            const paid = parseFloat(item.paid) || 0;
            const remaining = total - paid;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>$${total.toFixed(2)}</td>
                <td style="color: #4ade80;">$${paid.toFixed(2)}</td>
                <td style="color: ${remaining > 0 ? '#f43f5e' : '#4ade80'};">$${remaining.toFixed(2)}</td>
                <td>${item.installments} دفعات</td>
                <td>${item.date}</td>
                <td>
                    <button class="btn-action" onclick="addPaymentToMe(${index})">دفعة+</button>
                    <button class="btn-danger" onclick="deleteDebtOnMe(${index})">حذف</button>
                </td>
            `;
            debtOnMeTableBody.appendChild(row);
        });
    }
}

// 2. عرض ديون "للناس عندي" (مديون للآخرين)
function renderDebtsToOthers() {
    debtToOthersTableBody.innerHTML = '';
    if (debtsToOthers.length === 0) {
        emptyDebtToOthers.style.display = 'block';
    } else {
        emptyDebtToOthers.style.display = 'none';
        debtsToOthers.forEach((item, index) => {
            const total = parseFloat(item.total) || 0;
            const received = parseFloat(item.received) || 0;
            const remaining = total - received;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>$${total.toFixed(2)}</td>
                <td style="color: #4ade80;">$${received.toFixed(2)}</td>
                <td style="color: ${remaining > 0 ? '#f43f5e' : '#4ade80'};">$${remaining.toFixed(2)}</td>
                <td>${item.date}</td>
                <td>
                    <button class="btn-action" onclick="addPaymentToOther(${index})">قبض+</button>
                    <button class="btn-danger" onclick="deleteDebtToOther(${index})">حذف</button>
                </td>
            `;
            debtToOthersTableBody.appendChild(row);
        });
    }
}

// تحديث الإحصائيات والأرقام الكلية في الـ Bento Grid
function updateStats() {
    let sumTotalOwed = 0;
    let sumRemainingToPay = 0;
    let sumLentToOthers = 0;

    debtsOnMe.forEach(item => {
        const total = parseFloat(item.total) || 0;
        const paid = parseFloat(item.paid) || 0;
        sumTotalOwed += total;
        sumRemainingToPay += (total - paid);
    });

    debtsToOthers.forEach(item => {
        const total = parseFloat(item.total) || 0;
        const received = parseFloat(item.received) || 0;
        sumLentToOthers += (total - received);
    });

    totalOwedByMeEl.textContent = `$${sumTotalOwed.toFixed(2)}`;
    totalRemainingToPayEl.textContent = `$${sumRemainingToPay.toFixed(2)}`;
    totalLentToOthersEl.textContent = `$${sumLentToOthers.toFixed(2)}`;
}

// Form Submit: دين مترتب عليك
if (debtOnMeForm) {
    debtOnMeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const newDebt = {
            name: document.getElementById('creditorName').value,
            total: document.getElementById('debtTotalAmount').value,
            paid: document.getElementById('debtPaidAmount').value || 0,
            installments: document.getElementById('debtInstallments').value,
            date: document.getElementById('debtDate').value
        };

        debtsOnMe.push(newDebt);
        localStorage.setItem('debtsOnMe', JSON.stringify(debtsOnMe));
        renderAll();
        debtOnMeForm.reset();
    });
}

// Form Submit: دين للآخرين (لك عند الناس)
if (debtToOthersForm) {
    debtToOthersForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const newLent = {
            name: document.getElementById('debtorName').value,
            total: document.getElementById('lentAmount').value,
            received: document.getElementById('lentReceivedAmount').value || 0,
            date: document.getElementById('lentDate').value
        };

        debtsToOthers.push(newLent);
        localStorage.setItem('debtsToOthers', JSON.stringify(debtsToOthers));
        renderAll();
        debtToOthersForm.reset();
    });
}

// إضافة دفعة لدين مترتب عليك
function addPaymentToMe(index) {
    const val = prompt("أدخل مبلغ الدفعة الجديدة التي دفعته ($):");
    if (val !== null && val.trim() !== "") {
        const amt = parseFloat(val);
        if (!isNaN(amt) && amt > 0) {
            debtsOnMe[index].paid = (parseFloat(debtsOnMe[index].paid) || 0) + amt;
            localStorage.setItem('debtsOnMe', JSON.stringify(debtsOnMe));
            renderAll();
        } else {
            alert("الرجاء إدخال رقم صحيح.");
        }
    }
}

// إضافة قبض لدين لك عند شخص
function addPaymentToOther(index) {
    const val = prompt("أدخل المبلغ المقبوض من الشخص ($):");
    if (val !== null && val.trim() !== "") {
        const amt = parseFloat(val);
        if (!isNaN(amt) && amt > 0) {
            debtsToOthers[index].received = (parseFloat(debtsToOthers[index].received) || 0) + amt;
            localStorage.setItem('debtsToOthers', JSON.stringify(debtsToOthers));
            renderAll();
        } else {
            alert("الرجاء إدخال رقم صحيح.");
        }
    }
}

// حذف دين مترتب عليك
function deleteDebtOnMe(index) {
    debtsOnMe.splice(index, 1);
    localStorage.setItem('debtsOnMe', JSON.stringify(debtsOnMe));
    renderAll();
}

// حذف دين للآخرين
function deleteDebtToOther(index) {
    debtsToOthers.splice(index, 1);
    localStorage.setItem('debtsToOthers', JSON.stringify(debtsToOthers));
    renderAll();
}

// التشغيل الأولي
renderAll();