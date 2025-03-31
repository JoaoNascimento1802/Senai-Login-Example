document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form');
    const toggleLink = document.getElementById('toggle-link');
    const formTitle = document.getElementById('form-title');
    const nameField = document.getElementById('name-field');
    const toggleText = document.getElementById('toggle-text');

    function toggleForm() {
        if (formTitle.innerText === 'Cadastro') {
            formTitle.innerText = 'Login';
            nameField.style.display = 'none';
            toggleText.innerHTML = "Não tem uma conta? <a href='#' id='toggle-link'>Cadastre-se</a>";
        } else {
            formTitle.innerText = 'Cadastro';
            nameField.style.display = 'block';
            toggleText.innerHTML = "Já tem uma conta? <a href='#' id='toggle-link'>Faça login</a>";
        }

        document.getElementById("toggle-link").addEventListener("click", function (e) {
            e.preventDefault();
            toggleForm();
        });
    }

    toggleLink.addEventListener('click', function (e) {
        e.preventDefault();
        toggleForm();
    });

    // Envio do formulário para login ou cadastro
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const name = document.getElementById('name') ? document.getElementById('name').value : '';
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const isCadastro = formTitle.innerText === 'Cadastro';

        const url = isCadastro
            ? 'http://localhost:8080/auth/addNewUser'
            : 'http://localhost:8080/auth/generateToken';

        const body = isCadastro
            ? JSON.stringify({ name, email, password, roles: 'USER' })
            : JSON.stringify({ username: email, password });

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: body
            });

            // Verifica se a resposta é JSON ou texto
            const contentType = response.headers.get("content-type");
            let data;
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                data = await response.text(); // Lê a resposta como texto
            }

            if (!response.ok) {
                throw new Error(data || 'Erro na requisição');
            }

            if (isCadastro) {
                alert('Cadastro realizado com sucesso!');
                toggleForm();
            } else {
                if (typeof data === "object" && data.token) {
                    localStorage.setItem('authToken', data.token);
                    alert('Login realizado com sucesso!');
                    window.location.href = 'https://www.youtube.com/';
                } else {
                    throw new Error('Credenciais inválidas');
                }
            }
        } catch (error) {
            console.error('Erro:', error);
            alert(isCadastro ? 'Erro ao realizar cadastro' : 'Credenciais inválidas');
        }
    });
});
