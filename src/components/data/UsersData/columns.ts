export const columnsData = (isFullData: boolean) => {
  return [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Имя",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Создан",
      dataIndex: "createdAt",
      key: "createdAt",
    },

    ...(isFullData
      ? [
          {
            title: "Код торгового",
            dataIndex: "tradingСode",
            key: "tradingСode",
          },
          {
            title: "Дата рождения",
            dataIndex: "birthDate",
            key: "birthDate",
          },
          {
            title: "Телефоны",
            dataIndex: "phones",
            key: "phones",
          },

          {
            title: "Дата первого выезда",
            dataIndex: "dateFirstTrip",
            key: "dateFirstTrip",
          },
          {
            title: "Дети?",
            dataIndex: "isHaveChildren",
            key: "isHaveChildren",
          },
          {
            title: "Вод-ские права?",
            dataIndex: "isHaveDriverLicense",
            key: "isHaveDriverLicense",
          },
          {
            title: "Стаж вождения",
            dataIndex: "drivingExperience",
            key: "drivingExperience",
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
          {
            title: "Гражданства",
            dataIndex: "citizenships",
            key: "citizenships",
          },
          {
            title: "Ин-ные языки",
            dataIndex: "foreignLanguages",
            key: "foreignLanguages",
          },
        ]
      : []),
    {
      title: "Активен?",
      dataIndex: "isActive",
      key: "isActive",
    },
    {
      title: "Онлайн?",
      dataIndex: "isOnline",
      key: "isOnline",
    },
    {
      title: "Действия",
      dataIndex: "actions",
      key: "actions",
    },
  ];
};
