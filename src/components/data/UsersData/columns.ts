export const columnsData = (isFullData: boolean) => {
  return [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },

    {
      title: "Создан",
      dataIndex: "createdAt",
      key: "createdAt",
    },

    ...(isFullData
      ? [
          {
            title: "Имя",
            dataIndex: "fullName",
            key: "fullName",
          },
          {
            title: "Дата рождения",
            dataIndex: "birthDate",
            key: "birthDate",
          },
          {
            title: "Гражданства",
            dataIndex: "citizenships",
            key: "citizenships",
          },
          {
            title: "Адрес прописки",
            dataIndex: "registrationAddress",
            key: "registrationAddress",
          },
          {
            title: "Адрес проживания",
            dataIndex: "actualAddress",
            key: "actualAddress",
          },
          {
            title: "Пасспорт",
            dataIndex: "passportNumber",
            key: "passportNumber",
          },
          {
            title: "Языки",
            dataIndex: "foreignLanguages",
            key: "foreignLanguages",
          },
          {
            title: "Телефоны",
            dataIndex: "phones",
            key: "phones",
          },
          {
            title: "Код торгового",
            dataIndex: "tradingСode",
            key: "tradingСode",
          },

          {
            title: "Первый выезд",
            dataIndex: "dateFirstTrip",
            key: "dateFirstTrip",
          },
          {
            title: "Стаж вождения",
            dataIndex: "drivingExperience",
            key: "drivingExperience",
          },
          {
            title: "Вод. права?",
            dataIndex: "isHaveDriverLicense",
            key: "isHaveDriverLicense",
          },
          {
            title: "Дети?",
            dataIndex: "isHaveChildren",
            key: "isHaveChildren",
          },

          {
            title: "Загран паспорт?",
            dataIndex: "isHaveInterPassport",
            key: "isHaveInterPassport",
          },
          {
            title: "Брак?",
            dataIndex: "isInMarriage",
            key: "isInMarriage",
          },
        ]
      : []),
    {
      title: "Активен?",
      dataIndex: "isActive",
      key: "isActive",
    },
    // {
    //   title: "Онлайн?",
    //   dataIndex: "isOnline",
    //   key: "isOnline",
    // },
    {
      title: "Действия",
      dataIndex: "actions",
      key: "actions",
    },
  ];
};
