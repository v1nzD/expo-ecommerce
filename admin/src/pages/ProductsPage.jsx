import { useState } from "react";
import {
  PlusIcon,
  PencilIcon,
  Trash2Icon,
  XIcon,
  ImageIcon,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "../lib/api";
import { getStockStatusBadge } from "../lib/utils";

const ProductsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
  }); // these fields should be the same as in backend => createProduct controller

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // default value is []
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: productApi.getAll,
  });

  const createProductMutation = useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      // todo:
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: productApi.update,
    onSuccess: () => {
      // todo:
    },
  });

  const closeModal = () => {
    // reset the modal state
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "",
      price: "",
      stock: "",
      description: "",
    });
    setImages([]);
    setImagePreviews([]);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description,
    });
    setImagePreviews(product.images);
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) return alert("Maximum of 3 images allowed");

    setImages(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = (e) => {
    // doesnt refresh the page when form is submitted
    e.preventDefault();

    // for new products, require images
    if (!editingProduct && imagePreviews.length === 0) {
      return alert("Please upload at least one image");
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("stock", formData.stock);
    formDataToSend.append("category", formData.category);

    // only append new images if they were selected
    if (images.length > 0) {
      images.forEach((image) => formDataToSend.append("images", image));
    }

    if (editingProduct) {
      updateProductMutation.mutate({
        id: editingProduct._id,
        formData: formDataToSend,
      });
    } else {
      createProductMutation.mutate(formDataToSend);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-base-content/70 mt-1">
            Manage your product inventory
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 gap-4">
        {products.map((product) => {
          const status = getStockStatusBadge(product.stock);

          return (
            <div key={product._id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center gap-6">
                  {/* PRODUCT AVATAR */}
                  <div className="avatar">
                    <div className="w-20 rounded-xl">
                      <img src={product.images[0]} alt={product.name} />
                    </div>
                  </div>

                  {/* PRODUCT INFO */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="card-title">{product.name}</h3>
                        <p className="text-base-content/70 text-sm">
                          {product.category}
                        </p>
                      </div>

                      <div className={`badge ${status.class}`}>
                        {status.text}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mt-4">
                      <div>
                        <p className="text-xs text-base-content/7-">Price</p>
                        <p className="font-bold text-lg">${product.price}</p>
                      </div>

                      <div>
                        <p className="text-xs text-base-content/70">Stock</p>
                        <p className="font-bold text-lg">
                          {product.stock} units
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* PRODUCTS CARD BUTTONS */}
                  <div className="card-actions">
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => handleEdit(product)}
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button className="btn btn-square btn-ghost text-error">
                      <Trash2Icon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductsPage;
