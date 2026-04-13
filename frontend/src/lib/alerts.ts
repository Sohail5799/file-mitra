import Swal from "sweetalert2";

const toast = Swal.mixin({
  toast: true,
  position: "top-end",
  timer: 2600,
  timerProgressBar: true,
  showConfirmButton: false
});

export function showSuccess(message: string) {
  return toast.fire({
    icon: "success",
    title: message
  });
}

export function showError(message: string) {
  return toast.fire({
    icon: "error",
    title: message
  });
}

