// Lista de alunos autorizados (primeiro nome, login sem pontos, senha sem barras)
const ALUNOS_AUTORIZADOS = {
  "25034397": { senha: "01112007", nome: "Adria" },
  "22020916": { senha: "16032007", nome: "Alisson" },
  "24112147": { senha: "10092007", nome: "Allan" },
  "22109233": { senha: "22072005", nome: "Ana" },
  "24016067": { senha: "07092008", nome: "Aryel" },
  "23023195": { senha: "16052006", nome: "Edenilson" },
  "25018416": { senha: "28081981", nome: "Elandia" },
  "24042734": { senha: "07062007", nome: "Eloisa" },
  "25018540": { senha: "10071976", nome: "Francisco" },
  "21010535": { senha: "05092006", nome: "Ian" },
  "24184644": { senha: "11042006", nome: "Jailton" },
  "22067963": { senha: "19102007", nome: "Jarliano" },
  "24179508": { senha: "24102007", nome: "Laiane" },
  "22058237": { senha: "14032007", nome: "Leonardo" },
  "25018452": { senha: "06041989", nome: "Leudimara" },
  "24179476": { senha: "11022006", nome: "Luana" },
  "23069807": { senha: "06102007", nome: "Madson" },
  "25018353": { senha: "27102004", nome: "Mailson" },
  "25018608": { senha: "05022007", nome: "Marcelo" },
  "25036566": { senha: "20101975", nome: "Maria" },
  "25018626": { senha: "24042008", nome: "Moises" },
  "25018400": { senha: "11092005", nome: "Nalbert" },
  "25019552": { senha: "25062008", nome: "Naryelle" },
  "25018406": { senha: "30052008", nome: "Paulo" },
  "24176489": { senha: "21112007", nome: "Richarles" },
  "23053221": { senha: "15112007", nome: "Victor" },
  "24178823": { senha: "19122008", nome: "Vitoria" }
};

const ADMIN_LOGIN = "Admin";
const ADMIN_SENHA = "125695";

// ✅ EXPORTAÇÃO PARA O ESCOPO GLOBAL, CORRIGINDO O ERRO
window.ALUNOS_AUTORIZADOS = ALUNOS_AUTORIZADOS;
window.ADMIN_LOGIN = ADMIN_LOGIN;
window.ADMIN_SENHA = ADMIN_SENHA;
