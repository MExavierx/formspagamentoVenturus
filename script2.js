// seleciona os elementos do html que serão utilizados para adicionar e apresentar as movimentações
const tbody = document.querySelector("#tbody");
const descItem = document.querySelector("#desc");
const amount = document.querySelector("#amount");
const type = document.querySelector("#type");
const addBtn = document.querySelector("#addBtn");
const category = document.querySelector("#category");

// seleciona os campos responsáveis por apresentar o resumo financeiro
const incomes = document.querySelector(".incomes"); 
const expenses = document.querySelector(".expenses"); 
const total = document.querySelector(".total");

// cria a variável que vai armazenar as movimentações financeiras
let items; 

// adiciona uma nova movimentação após clicar no botão
addBtn.onclick = () => {
    // verifica se todos os campos foram preenchidos antes de continuar
    if (descItem.value === "" || amount.value === "" || type.value === "" || category.value === ""){
        return alert("Preencha todos os campos!");
    }

    // armazena as informações preenchidas em um novo objeto
    items.push({
        desc: descItem.value,
        amount: Math.abs(amount.value).toFixed(2), 
        type: type.value,
        category: category.value
    });

    // salva as informações e atualiza a tabela
    setItensBD(); 
    loadItens(); 

    // limpa os campos de descrição e valor após adicionar a movimentação
    descItem.value = ""; 
    amount.value = "";
}; 

// remove uma movimentação da lista de acordo com seu índice
function deleteItem(index) {
    items.splice(index, 1); 
    setItensBD(); 
    loadItens();
}

// cria uma linha na tabela para apresentar os dados de cada movimentação
function insertItem(item, index){
    let tr = document.createElement("tr"); 

    // organiza as informações e define o ícone de acordo com o tipo de movimentação
    tr.innerHTML = `
    <td>${item.desc}</td> 
    <td>R$ ${item.amount}</td> 
    <td class="columnType">${
        item.type === "Entrada"
        ? '<i class="bx bxs-chevron-up-circle"></i>'
        : '<i class="bx bxs-chevron-down-circle"></i>'
    }</td>

    <td class="columnAction"> 
        <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button> 
    </td> 

    <td class="columnCategory">${item.category}</td>
    `;

    // adiciona a nova linha na tabela
    tbody.appendChild(tr);
}

// recupera as movimentações salvas e atualiza as informações da página
function loadItens() {
    items = getItensBD(); 
    tbody.innerHTML = "";
    items.forEach((item, index) => {
        insertItem(item, index);
    })

    // atualiza os valores do resumo financeiro
    getTotals();
}

// calcula os valores de entrada, saída e saldo total
function getTotals(){
    // filtra as movimentações de entrada e transforma os valores em números
    const amountIncomes = items 
        .filter((item) => item.type === "Entrada")
        .map((transaction) => Number(transaction.amount)); 

    // filtra as movimentações de saída e transforma os valores em números
    const amountExpenses = items
        .filter((item) => item.type === "Saída")
        .map((transaction) => Number(transaction.amount)); 

    // soma todas as entradas e formata o resultado com duas casas decimais
    const totalIncomes = amountIncomes 
        .reduce((acc, cur) => acc + cur, 0)
        .toFixed(2); 

    // soma todas as saídas e apresenta o resultado como valor positivo
    const totalExpenses = Math.abs(
        amountExpenses.reduce((acc, cur) => acc + cur, 0) 
    ).toFixed(2)

    // calcula o saldo final subtraindo as saídas das entradas
    const totalItems = (Number(totalIncomes) - Number(totalExpenses)).toFixed(2);

    // atualiza os valores apresentados no resumo financeiro
    incomes.innerHTML = totalIncomes; 
    expenses.innerHTML = totalExpenses; 
    total.innerHTML = totalItems;
}

// recupera as movimentações armazenadas no localStorage
const getItensBD = () => JSON.parse(localStorage.getItem("db_items")) ?? []; 

// salva as movimentações no localStorage em formato JSON
const setItensBD = () => 
    localStorage.setItem("db_items", JSON.stringify(items)); 

// carrega as movimentações assim que a página é iniciada
loadItens();