const { createApp } = Vue

createApp({
  data() {
    return {
      productos: [],
      //url:'http://localhost:5000/productos',
      // si el backend esta corriendo local usar localhost 5000(si no lo subieron a pythonanywhere)
      url: 'https://jjscialfa.pythonanywhere.com/productos', // si ya lo subieron a pythonanywhere
      error: false,
      cargando: true,
      /*atributos para el guardar los valores del formulario */
      id: 0,
      nombre: "",
      imagen: "",
      stock: 0,
      precio: 0,
      nombreError: false,
      precioError: false,
      stockError: false,
    }
  },
  methods: {
    fetchData(url) {
      fetch(url)
        .then(response => response.json())
        .then(data => {
          this.productos = data;
          this.cargando = false;
        })
        .catch(err => {
          console.error(err);
          this.error = true;
        })
    },
    eliminar(producto) {
        const confirmacion = confirm("¿Confirma la eliminación de este producto?");
        if (confirmacion) {
          const url = this.url + '/' + producto;
          var options = {
            method: 'DELETE',
          };
          fetch(url, options)
            .then(res => res.text()) // or res.json()
            .then(res => {
              location.reload();
            });
        }
      },
    grabar() {
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

      // Si no hay errores, realizar la acción de grabar
      if (!this.nombreError && !this.precioError && !this.stockError) {
        let producto = {
          nombre: this.nombre,
          precio: this.precio,
          stock: this.stock,
          imagen: this.imagen
        };
        var options = {
          body: JSON.stringify(producto),
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          redirect: 'follow'
        }
        fetch(this.url, options)
          .then(() => {
            alert("Registro grabado");
            window.location.href = "../templates/productos.html";
          })
          .catch(err => {
            console.error(err);
            alert("Error al Grabar");
          });
      }else {
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
    this.fetchData(this.url)
  },
}).mount('#app');
