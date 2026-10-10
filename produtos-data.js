/* DADOS DO CATÁLOGO (exemplo). Para adicionar um produto, copie uma linha e edite.
   cat: tubos | caixas | sanitarios | incendio
   img: caminho da foto (ex.: 'img/produtos/00001.jpg'). Vazio = mostra o ícone da categoria. */
window.CATEGORIAS = [
  { id: 'tubos', nome: 'Tubos e conexões' },
  { id: 'caixas', nome: "Caixas d'água" },
  { id: 'sanitarios', nome: 'Materiais sanitários' },
  { id: 'incendio', nome: 'Combate a incêndio' }
];
window.PRODUTOS = [
  { cod: '00001', nome: 'Tubo PVC soldável 25 mm', marca: 'Tigre', cat: 'tubos', img: '' },
  { cod: '00002', nome: 'Joelho 90° soldável 25 mm', marca: 'Tigre', cat: 'tubos', img: '' },
  { cod: '00003', nome: 'Luva soldável 32 mm', marca: 'Amanco Wavin', cat: 'tubos', img: '' },
  { cod: '00004', nome: 'Tubo de cobre 15 mm', marca: 'Eluma', cat: 'tubos', img: '' },
  { cod: '00005', nome: 'Joelho de ferro fundido 3/4"', marca: 'Tupy', cat: 'tubos', img: '' },
  { cod: '00006', nome: "Caixa d'água 500 L", marca: 'Fortlev', cat: 'caixas', img: '' },
  { cod: '00007', nome: "Caixa d'água 1.000 L", marca: 'Fortlev', cat: 'caixas', img: '' },
  { cod: '00008', nome: 'Torneira de boia 1/2"', marca: 'Amanco Wavin', cat: 'caixas', img: '' },
  { cod: '00009', nome: 'Bacia sanitária com caixa acoplada', marca: 'Deca', cat: 'sanitarios', img: '' },
  { cod: '00010', nome: 'Assento sanitário', marca: 'Deca', cat: 'sanitarios', img: '' },
  { cod: '00011', nome: 'Chuveiro eletrônico', marca: 'Lorenzetti', cat: 'sanitarios', img: '' },
  { cod: '00012', nome: 'Torneira de mesa para banheiro', marca: 'Docol', cat: 'sanitarios', img: '' },
  { cod: '00013', nome: 'Registro de gaveta 2"', marca: 'Apolo', cat: 'incendio', img: '' },
  { cod: '00014', nome: 'Válvula de retenção 2"', marca: 'Apolo', cat: 'incendio', img: '' }
];
