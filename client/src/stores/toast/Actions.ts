import Toaster from './Types';

export default function resetToaster() {
  return {
    type: Toaster.TOAST.RESET,
  };
}
