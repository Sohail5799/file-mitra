import Swal from "sweetalert2";

const toast = Swal.mixin({
  toast: true,
  position: "top-end",
  timer: 2800,
  timerProgressBar: true,
  showConfirmButton: false,
  width: "min(22rem, calc(100vw - 1.25rem))",
  customClass: {
    title: "fm-toast-title"
  }
});

export function showSuccess(message: string) {
  return toast.fire({
    title: message,
    customClass: {
      popup: "fm-toast-popup fm-toast-popup--success",
      title: "fm-toast-title"
    }
  });
}

export function showError(message: string) {
  return toast.fire({
    title: message,
    customClass: {
      popup: "fm-toast-popup fm-toast-popup--error",
      title: "fm-toast-title"
    }
  });
}

