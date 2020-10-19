import { isEqual } from 'lodash';
import { createBrowserHistory } from 'history';
import { Toaster } from '@blueprintjs/core';
import { store } from 'Store';
import { includes } from 'lodash';
import { ICompanyRoom } from './room/Reducer';
import { tigrowApi } from 'config';

const toaster = Toaster.create();

const History = createBrowserHistory();
export interface Entity {
  _id?: string;
  name: string;
}
export const tokenConfig = () => {
  const token =
    typeof window !== undefined &&
    localStorage.getItem('tigrow_acc_id')
      ? JSON.parse(localStorage.getItem('tigrow_acc_id')!)
      : null;
  if (
    !localStorage.getItem('tigrow_acc_id') ||
    !localStorage.getItem('tigrow_real_id')
  ) {
    localStorage.removeItem('tigrow_acc_id');
    localStorage.removeItem('tigrow_real_id');
    toaster.show({
      message: 'Token is invalid. Please sign in.',
      intent: 'danger',
    });
    History.push('/signin');
    window.location.reload(false);
  }
  return {
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
      ClientId: store.getState().notificationReducer.socketId,
      CompanyId: store.getState().companyReducer.currentCompany._id,
    },
  };
};

export const adminTokenConfig = () => {
  return {
    headers: {
      'Content-type': 'application/json',
      companyid: store.getState().companyReducer.currentCompany._id,
    },
  };
};

export const tokenConfigFIleUpload = () => {
  const token =
    typeof window !== undefined &&
    localStorage.getItem('tigrow_acc_id')
      ? JSON.parse(localStorage.getItem('tigrow_acc_id')!)
      : null;
  if (
    !localStorage.getItem('tigrow_acc_id') ||
    !localStorage.getItem('tigrow_real_id')
  ) {
    localStorage.removeItem('tigrow_acc_id');
    localStorage.removeItem('tigrow_real_id');
    toaster.show({
      message: 'Token is invalid. Please sign in.',
      intent: 'danger',
    });
    History.push('/signin');
    window.location.reload(false);
  }
  return {
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${token}`,
    },
  };
};

export const isAuthenticate = () => {
  if (typeof window === undefined) {
    return false;
  }

  if (
    localStorage.getItem('tigrow_acc_id') &&
    localStorage.getItem('tigrow_real_id')
  ) {
    return JSON.parse(localStorage.getItem('tigrow_acc_id')!);
  } else {
    return false;
  }
};

export const projectPermit = (companyRole: string): boolean => {
  if (
    isEqual(companyRole, 'superAdmin') ||
    isEqual(companyRole, 'admin')
  ) {
    return true;
  } else {
    return false;
  }
};

type AdminOptionalPermissioRoles =
  | 'editProfile'
  | 'cRUDAnnouncement'
  | 'archiveProject'
  | 'addRemoveModerator'
  | 'messageAssociate'
  | 'addAcceptRejectAssociate'
  | 'acceptRejectProjectFromAssociate';

export const companyPermit = (
  companyRole: string,
  optionalPermissions?: AdminOptionalPermissioRoles,
): boolean => {
  const adminPermissions = store.getState().companyReducer
    .currentCompany.optionalRole;
  let permitStatus = false;
  switch (companyRole) {
    case 'superAdmin':
      permitStatus = true;
      break;
    case 'admin':
      if (optionalPermissions) {
        if (includes(adminPermissions, optionalPermissions)) {
          permitStatus = true;
        } else {
          permitStatus = false;
        }
      } else {
        permitStatus = true;
      }
      break;
    default:
      permitStatus = false;
  }
  return permitStatus;
};

export const passwordValidation = (password: string) => {
  const regex = /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/;
  if (password.match(regex)) {
    return true;
  } else {
    return false;
  }
};

export const Color = [
  { code: 0, value: '#FA617F' },
  { code: 1, value: '#A8D16B' },
  { code: 2, value: '#FFD7D0' },
  { code: 3, value: '#FE5E41' },
  { code: 4, value: '#3F61C5' },
  { code: 5, value: '#11B468' },
  { code: 6, value: '#5A1DD6' },
];

export const priorityColor = [
  {
    code: 0,
    name: 'Highest',
    value: '#C43600',
    container: '#F9E9E3',
  },
  { code: 1, name: 'High', value: '#CB5800', container: '#F9EDE3' },
  { code: 2, name: 'Medium', value: '#D48A0B', container: '#FFF5E3' },
  { code: 3, name: 'Low', value: '#5387AF', container: '#ECF2F6' },
  { code: 4, name: 'Lowest', value: '#093F68', container: '#E4EAEE' },
];

export const parseJwt = (token: any) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );
  const json = JSON.parse(jsonPayload);
  return json.exp;
};

export const isEmail = (email: string) => {
  const regexForEmailValidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regexForEmailValidation)) {
    return true;
  }
  return false;
};

export const unreadMessageNotification = (
  companyRooms: ICompanyRoom[],
  key: string,
  id: string,
): boolean => {
  let unread = false;
  if (companyRooms.length > 0) {
    for (const room of companyRooms) {
      if (room[key] === id && room.unreadCount > 0) {
        unread = true;
        break;
      }
    }
  }
  return unread;
};

export const stripeCheckout = async (
  stripe: any,
  companyId: string,
  getway: string,
  userLastName: string,
  userFirstName: string,
  CardElement: any,
  elements,
  getSubscription,
  amount,
) => {
  // const getway =
  //     value === 'international' ? 'stripe' : 'portwallet';
  const headers = tokenConfig();
  const response = await tigrowApi.post(
    'payments/stripe/intent',
    {
      amount: amount,
    },
    headers,
  );
  const clientSecret = await response.data.client_secret;
  // @ts-ignore: Unreachable code error
  const result = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      // @ts-ignore: Unreachable code error
      card: elements.getElement(CardElement),
      billing_details: {
        name: `${userFirstName} ${userLastName}`,
      },
    },
  });

  if (result.error) {
    // Show error to your customer (e.g., insufficient funds)
    // console.log(result.error.message);
    return false;
  } else {
    // The payment has been processed!
    if (
      result.paymentIntent &&
      result.paymentIntent!.status === 'succeeded'
    ) {
      // setSuccess(true);
      await tigrowApi.post(
        `payments/${companyId}`,
        {
          amount: result.paymentIntent.amount,
          currency: result.paymentIntent.currency,
          reference: result.paymentIntent.id,
          company: companyId,
          gateway: getway,
          subscription: getSubscription.data.subscription,
        },
        headers,
      );
      // Show a success message to your customer
      // There's a risk of the customer closing the window before callback
      // execution. Set up a webhook or plugin to listen for the
      // payment_intent.succeeded event that handles any business critical
      // post-payment actions.
    }
  }
  return true;
};

interface IProtWalletForm {
  name: string;
  email: string;
  phone: string;
  zipCode: string;
  city: string;
  state: string;
  house: string;
}

export const portWalletCheckout = async (
  formData: IProtWalletForm,
  amount,
  productId,
  companyName,
) => {
  // const getway =
  //     value === 'international' ? 'stripe' : 'portwallet';
  const headers = tokenConfig();
  const response = await tigrowApi.post(
    'payments/portwallet/initiate',
    {
      amount: amount,
      redirect_url: `${window.location.origin}/company/${companyName}/settings/payment/success`,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      city: formData.city,
      state: formData.state,
      country: 'BD',
      zipcode: formData.zipCode,
      adress: formData.house,
      call: '',
      currency: 'BDT',
      product_name: productId,
      product_description: 'Dummy',
    },
    headers,
  );
  const paymentUrl = response.data.paymentUrl;
  window.location.replace(`${paymentUrl}`);
  // @ts-ignore: Unreachable code error
};
export const capitalizeName = (name: string) => {
  return name
    .toLowerCase()
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
};

export const addSpace = (name: string) => {
  name = name.replace(/([A-Z])/g, ' $1').trim();
  return capitalizeName(name);
};






