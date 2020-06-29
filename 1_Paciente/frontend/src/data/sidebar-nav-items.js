export default function() {
  return [
    {
      title: 'Dashboard',
      to: '/dashboard',
      htmlBefore: '<i class="material-icons">home</i>',
      htmlAfter: '',
    },
    {
      title: 'Lista de Pacientes',
      to: '/patient-list',
      htmlBefore: '<i class="material-icons">list</i>',
      htmlAfter: '',
    },
    {
      title: 'Cadastro de Pacientes',
      to: '/patient-form',
      htmlBefore: '<i class="material-icons">assignment_ind</i>',
      htmlAfter: '',
    },
    {
      title: 'Lista de Médicos',
      to: '/physician-list',
      htmlBefore: '<i class="material-icons">list</i>',
      htmlAfter: '',
    },
    {
      title: 'Cadastro de Médicos',
      to: '/physician-form',
      htmlBefore: '<i class="material-icons">healing</i>',
      htmlAfter: '',
    },
    {
      title: 'Especialidades',
      to: '/specialties',
      htmlBefore: '<i class="material-icons">folder_special</i>',
      htmlAfter: '',
    },
    {
      title: 'Atendimento',
      to: '/step1',
      htmlBefore: '<i class="material-icons">add_to_home_screen</i>',
      htmlAfter: '',
    },
    {
      title: 'Agenda Médica',
      to: '/schedule',
      htmlBefore: '<i class="material-icons">assignment_turned_in</i>',
    },
    /*{
       title: "Forms & Componentes",
       htmlBefore: '<i class="material-icons">view_module</i>',
       to: "/components-overview",
     },
     {
       title: "Tabelas",
       htmlBefore: '<i class="material-icons">table_chart</i>',
       to: "/tables",
     },
     {
       title: "Erros",
       htmlBefore: '<i class="material-icons">error</i>',
       to: "/errors",
     }*/
  ];
}
