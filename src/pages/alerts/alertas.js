import swal from "sweetalert";

const sucesso = (titulo = "Tudo okey!", mensagem) => {
    swal(titulo, mensagem, "success");
};

const erro = (titulo, mensagem) => {
    swal(titulo, mensagem, "error");
};

export { sucesso, erro };