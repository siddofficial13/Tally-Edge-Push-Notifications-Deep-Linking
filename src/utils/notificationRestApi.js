const sendSingleDeviceNotification = async () => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append(
    'Cookie',
    'jwt-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjNmOTNkNmU5MzQzNGMyODk5NmNkMzIiLCJpYXQiOjE3MTU1MDQ0NzcsImV4cCI6MTc0NjYwODQ3N30.SpGuBuMbuMV4k27-lbvT_-ia989ai2WtrHkMsuEsgfE',
  );

  const raw = JSON.stringify({
    token:
      'fZW6mPnqSoGBZ__qc1ZwPW:APA91bFEcQY_y4QWYLQ5aAkHC_M09LEjwJn-gyQiO5b4s_NKD_x1FXqc2dOES-NY7IH1Vc873cAa2fLDlJnjG8DYuAV4qLE1F6M-GCwrHYMDV0mY4uAW_uHdwFhxcBcK2FQGZsnPWFnR',
    title: 'Test Notification',
    body: 'This is a test notification',
    data: {
      redirect_to: 'Details',
    },
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  try {
    const response = await fetch('localhost:8085/api/send', requestOptions);
    const result = await response.text();
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

export default {
  sendSingleDeviceNotification,
};
