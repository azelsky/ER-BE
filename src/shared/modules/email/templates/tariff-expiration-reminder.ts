import { calculateDaysLeft } from '@shared/helper';

interface ITariffExpirationReminder {
  appLink: string;
  restaurantId: string;
  endDate: string;
}

export const TARIFF_EXPIRATIONS_REMINDER_SUBJECT = 'Термін дії тарифного плану закінчується';

export function tariffExpirationReminder({
  appLink,
  restaurantId,
  endDate
}: ITariffExpirationReminder): string {
  const daysLeft = calculateDaysLeft(new Date(endDate));
  const time = new Date(endDate).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  let daysLeftText = `сьогодні o ${time}`;

  if (daysLeft === 2) {
    daysLeftText = 'через два дня';
  } else if (daysLeft === 3) {
    daysLeftText = 'через три дня';
  }

  return `
 <!DOCTYPE html>
<html>
<head>
  <title>${TARIFF_EXPIRATIONS_REMINDER_SUBJECT}</title>
</head>
<body>
  <table style="width:100%; max-width:600px; margin:0 auto; font-family: Roboto,Helvetica Neue Light,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif; text-align: center;">
    <tr>
      <td>
        <img src="https://www.app.qringer.com/assets/logo-email.png" alt="Logo" style="width: 200px; background: transparent;">
        <h1 style="color: #333;">${TARIFF_EXPIRATIONS_REMINDER_SUBJECT}</h1>
        <p style="font-size: 24px; margin-bottom: 40px;">Ваш тарифний план закінчується ${daysLeftText}. Зверніть увагу, що після цього терміну ваш доступ до послуг буде обмежено.</p>
        <a href="${appLink}/home/admin/${restaurantId}/pricing-plans" style="background: linear-gradient(#732796, #732796); color: #fff; padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; text-decoration: none;" target="_blank">Оновити тарифний план</a>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
