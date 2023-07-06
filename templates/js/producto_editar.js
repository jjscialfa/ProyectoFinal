console.log(location.search) // lee los argumentos pasados a este formulario
var id = location.search.substr(4);
console.log(id);
const { createApp } = Vue;

createApp({
  data() {
    return {
      id: 0,
      nombre: "",
      imagen: "",
      stock: 0,
      precio: 0,
      url: 'http://jjscialfa.pythonanywhere.com/productos/' + id,
      nombreError: false,
      precioError: false,
      stockError: false,
    };
  },
  methods: {
    fetchData(url) {
      fetch(url)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          this.id = data.id;
          this.nombre = data.nombre;
          this.imagen = data.imagen;
          this.stock = data.stock;
          this.precio = data.precio;
        })
        .catch(err => {
          console.error(err);
          this.error = true;
        });
    },
    modificar() {
      this.nombreError = false;
      this.precioError = false;
      this.stockError = false;

      // Validar el nombre
      if (this.nombre.trim() === "") {
        this.nombreError = true;
      }

      // Validar el precio
      if (isNaN(this.precio) || this.precio === null || this.precio == 0) {
        this.precioError = true;
      }

      // Validar el stock
      if (isNaN(this.stock) || this.stock === null) {
        this.stockError = true;
      }

      // Si no hay errores, realizar la acción de modificar
      if (!this.nombreError && !this.precioError && !this.stockError) {
        let producto = {
          nombre: this.nombre,
          precio: this.precio,
          stock: this.stock,
          imagen: this.imagen,
        };
        var options = {
          body: JSON.stringify(producto),
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          redirect: 'follow',
        };
        fetch(this.url, options)
          .then(() => {
            alert("Registro modificado");
            window.location.href = "../templates/productos.html";
          })
          .catch(err => {
            console.error(err);
            alert("Error al Modificar");
          });
      } else {
        let mensajeError = "Se encontraron los siguientes errores:\n";
        if (this.nombreError) {
          mensajeError += "- El campo Nombre es obligatorio.\n";
        }
        if (this.precioError) {
          mensajeError += "- El campo Precio debe ser un valor numérico válido (mayor a cero).\n";
        }
        if (this.stockError) {
          mensajeError += "- El campo Stock debe ser un valor numérico válido.\n";
        }
        alert(mensajeError);
      }
    },
  },
  created() {
    this.fetchData(this.url);
  },
}).mount('#app');
