"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Select from "react-select";
import { HStack, parseColor } from "@chakra-ui/react";
import {
  ColorPickerArea,
  ColorPickerContent,
  ColorPickerControl,
  ColorPickerEyeDropper,
  ColorPickerInput,
  ColorPickerLabel,
  ColorPickerRoot,
  ColorPickerSliders,
  ColorPickerTrigger,
  ColorPickerValueSwatch,
} from "./color-picker";
import { AddButton, ResetButton } from "./button";
import { FaChevronUp, FaChevronDown, FaTrash, FaCamera } from "react-icons/fa6";
import { TbCopy, TbCopyCheck } from "react-icons/tb";
import "./edit.css";
import { discordWebhook, sendDiscordMessage } from "@/lib/discord";
import { hexToColor } from "@/lib/convertColor";
import { MdClose } from "react-icons/md";
import { delImage } from "@/lib/delImage";

const customStyles = {
  placeholder: (base) => ({
    ...base,
    color: "#333333",
  }),
  control: (base) => ({
    ...base,
    backgroundColor: "#17181f",
    border: "none",
    borderRadius: "10px",
    maxWidth: "300px",
    height: "50px",
    fontSize: "1em",
    padding: "0 5px",
    color: "#f9f9f9",
  }),
  indicatorSeparator: (base) => ({
    ...base,
    backgroundColor: "#272934",
    width: "2px",
  }),
  option: (base, state) => ({
    ...base,
    padding: "9px 15px",
    backgroundColor: state.isFocused ? "#222327" : "#15161b",
    color: "#f9f9f9",
    fontSize: "1em",
    "&:active": {
      backgroundColor: "#007bff",
      color: "white",
    },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#17181f",
    maxWidth: "600px",
    width: "100%",
  }),
  menuList: (base) => ({
    ...base,
    maxHeight: "170px",
    padding: 0,
    maxWidth: "600px",
    width: "100%",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#f9f9f9",
  }),
};

function EditSlider({ min, max, defaultValue = 0, step = 1, percentage = false, onChange, unit = "" }) {
  const [value, setValue] = React.useState(defaultValue);

  let desc = unit;
  desc = percentage ? "%" : unit;

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleRangeChange = (event) => {
    const newValue = Number(event.target.value);
    setValue(newValue);
    if (onChange) onChange(newValue);
  };

  const handleTextChange = (event) => {
    const newValue = event.target.value;
    if (/^\d*$/.test(newValue)) {
      const numericValue = newValue === "" ? 0 : Number(newValue);
      if (numericValue >= min && numericValue <= max) {
        setValue(numericValue);
        if (onChange) onChange(numericValue);
      }
    }
  };

  let valuePercentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="edit-range">
      <div className="subedit-range">
        <div className="subedit-range-container">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleRangeChange}
            className="subedit-range-input"
            style={{
              background: `linear-gradient(to right, #5865f2 ${valuePercentage}%, #17181f ${valuePercentage}%)`,
            }}
            aria-label="Range input"
          />
        </div>
        <div className="subedit-range-desc-container">
          <span className="subedit-range-desc">{min + desc}</span>
          <span className="subedit-range-desc">{max + desc}</span>
        </div>
      </div>
      <input type="text" value={value} onChange={handleTextChange} className="subedit-text" aria-label="Text input" />
    </div>
  );
}

function ConditionalForm({ formData: initialFormData, options, onChange }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    setFormData((prevData) => {
      if (JSON.stringify(prevData) !== JSON.stringify(initialFormData)) {
        return initialFormData;
      }
      return prevData;
    });
  }, [initialFormData]);

  useEffect(() => {
    const selected = options.find((opt) => initialFormData[opt.id] === opt.value);
    setSelectedOption(selected || null);
  }, [initialFormData, options]);

  const handleInputChange = (id, value) => {
    const updatedData = { ...formData, [id]: value };
    setFormData(updatedData);
    onChange(updatedData);
  };

  const handleFormChange = (data) => {
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        ...data,
        categories: {
          ...(data.categories || {}),
        },
      };

      onChange(updatedData);
      return updatedData;
    });
  };

  return (
    <div>
      <div style={{ maxWidth: "300px" }}>
        <Select
          options={options}
          onChange={(selectedOption) => {
            setSelectedOption(selectedOption);
            handleInputChange(selectedOption.id, selectedOption.value);
          }}
          styles={customStyles}
          placeholder="Select"
          value={options.find((opt) => opt.value === formData[selectedOption?.id]) || null}
        />
      </div>

      {selectedOption && (
        <Form
          formData={formData}
          options={options.find((option) => option.value === selectedOption?.value)?.inputs || []}
          onChange={(data) => handleFormChange(data)}
        />
      )}
    </div>
  );
}

function Form({ formData: initialFormData, options, onChange }) {
  const [formData, setFormData] = useState(initialFormData);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    setFormData(initialFormData);
    console.log(options);
  }, [initialFormData]);

  const handleInputChange = (id, value) => {
    const updatedData = { ...formData, [id]: value };
    setFormData(updatedData);
    onChange(updatedData);
  };

  const handleButtonClick = (action) => (event) => {
    event.preventDefault();

    if (action === "discord-webhook") {
      discordWebhook({
        webhookURL: formData.webhook_link,
        title: formData.embed_title,
        desc: formData.embed_desc,
        color: hexToColor(formData.embed_color),
        username: formData.wh_name,
        avatar: formData.wh_avatar,
        timestamp: formData.timestamp || new Date().toISOString(),
      });
    } else if (action === "discord-bot") {
      sendDiscordMessage({
        channelId: formData.channel_id,
        content: {
          title: formData.embed_title,
          description: formData.embed_desc,
          color: hexToColor(formData.embed_color),
          timestamp: formData.timestamp || new Date().toISOString(),
        },
        token: formData.bot_token,
        isEmbed: true,
      });
    } else {
      alert(`Button clicked: ${action}`);
    }
  };

  const toggleExpand = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  const renderPackageEditor = () => {
    const handleFileUpload = async (event, itemId) => {
      const file = event.target.files?.[0];
      if (!file) return;
  
      setIsUploading(true);
  
      const categoryKey = Object.keys(formData.categories).find((cat) => formData.categories[cat][itemId]);
  
      if (!categoryKey) {
        setIsUploading(false);
        return;
      }
  
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("folder", "items");
  
      if (formData.categories[categoryKey][itemId]?.image) {
        formDataUpload.append("oldFile", formData.categories[categoryKey][itemId].image);
      }
  
      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });
  
        if (response.ok) {
          const data = await response.json();
          handlePackageChange(itemId, "image", data.filename);
          handlePackageChange(itemId, "url", data.url);
        }
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setIsUploading(false);
      }
    };
  
    const handleDeleteItem = (itemId) => {
      setFormData((prev) => {
        const updatedCategories = { ...prev.categories };
        const categoryKey = Object.keys(updatedCategories).find((cat) => updatedCategories[cat][itemId]);
  
        if (!categoryKey) return prev;
  
        if (updatedCategories[categoryKey][itemId]?.image) {
          delImage("uploads", "items", updatedCategories[categoryKey][itemId].image);
        }
  
        // Create a new object without the deleted item
        const filteredCategory = Object.fromEntries(
          Object.entries(updatedCategories[categoryKey]).filter(([id]) => id !== itemId)
        );
        
        updatedCategories[categoryKey] = filteredCategory;
  
        const newFormData = {
          ...prev,
          categories: updatedCategories
        };
  
        onChange(newFormData);
        return newFormData;
      });
    };
  
    const handlePackageChange = (itemId, field, value) => {
      setFormData((prev) => {
        const updatedCategories = { ...prev.categories };
  
        const categoryKey = Object.keys(updatedCategories).find((cat) => updatedCategories[cat][itemId]);
  
        if (!categoryKey) return prev;
  
        updatedCategories[categoryKey] = {
          ...updatedCategories[categoryKey],
          [itemId]: {
            ...updatedCategories[categoryKey][itemId],
            [field]: value,
          },
        };
  
        const newFormData = { ...prev, categories: updatedCategories };
        onChange(newFormData);
        return newFormData;
      });
    };
  
    const moveItem = (itemId, direction) => {
      setFormData((prev) => {
        const categoryKey = Object.keys(prev.categories).find((cat) => prev.categories[cat][itemId]);
        if (!categoryKey) return prev;
  
        // Get all items in the category
        const categoryItems = prev.categories[categoryKey];
        const itemIds = Object.keys(categoryItems);
        
        // Find the current index
        const currentIndex = itemIds.indexOf(itemId);
        if (currentIndex === -1) return prev;
        
        // Calculate the new index
        const newIndex = direction === "up" 
          ? Math.max(0, currentIndex - 1) 
          : Math.min(itemIds.length - 1, currentIndex + 1);
        
        // No change needed if item is already at the boundary
        if (currentIndex === newIndex) return prev;
        
        // Reorder the items by creating a new ordered object
        const reorderedItems = {};
        
        // Create a new array with the reordered IDs
        const reorderedIds = [...itemIds];
        // Remove the item from its current position
        reorderedIds.splice(currentIndex, 1);
        // Insert it at the new position
        reorderedIds.splice(newIndex, 0, itemId);
        
        // Create a new object with the reordered items
        reorderedIds.forEach(id => {
          reorderedItems[id] = categoryItems[id];
        });
        
        // Update the category with the reordered items
        const updatedCategories = {
          ...prev.categories,
          [categoryKey]: reorderedItems
        };
        
        const newFormData = {
          ...prev,
          categories: updatedCategories
        };
  
        onChange(newFormData);
        return newFormData;
      });
    };
  
    const addItem = (e) => {
      e.preventDefault();
  
      const newItemId = `item_${Date.now()}`;
  
      setFormData((prev) => {
        const firstCategory = Object.keys(prev.categories)[0];
  
        const updatedData = {
          ...prev,
          categories: {
            ...prev.categories,
            [firstCategory]: {
              ...prev.categories[firstCategory],
              [newItemId]: {
                name: "Item",
                price: "5000",
                action: "",
                image: "",
              },
            },
          }
        };
  
        onChange(updatedData);
        return updatedData;
      });
    };
  
    const handleDragStart = (e, itemId, categoryKey) => {
      e.dataTransfer.setData(
        "text/plain",
        JSON.stringify({
          itemId,
          categoryKey,
        })
      );
      e.dataTransfer.effectAllowed = "move";
    };
  
    const handleDragOver = (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    };
  
    const handleDrop = (e, targetItemId, targetCategoryKey) => {
      e.preventDefault();
  
      try {
        const data = JSON.parse(e.dataTransfer.getData("text/plain"));
        const { itemId: draggedItemId, categoryKey: draggedCategoryKey } = data;
  
        // Don't do anything if dropping onto itself
        if (draggedItemId === targetItemId) return;
  
        setFormData((prev) => {
          // Create a copy of the categories
          const updatedCategories = { ...prev.categories };
  
          // Get the dragged item data
          const draggedItemData = updatedCategories[draggedCategoryKey][draggedItemId];
          if (!draggedItemData) return prev;
  
          // Case 1: Moving within the same category (reordering)
          if (draggedCategoryKey === targetCategoryKey) {
            // Get all items in the category
            const categoryItems = updatedCategories[targetCategoryKey];
            const itemIds = Object.keys(categoryItems);
            
            // Get current positions
            const draggedIndex = itemIds.indexOf(draggedItemId);
            const targetIndex = itemIds.indexOf(targetItemId);
            
            if (draggedIndex === -1 || targetIndex === -1) return prev;
            
            // Create a new array with the reordered IDs
            const reorderedIds = [...itemIds];
            // Remove the item from its current position
            reorderedIds.splice(draggedIndex, 1);
            // Insert it at the target position
            reorderedIds.splice(targetIndex, 0, draggedItemId);
            
            // Create a new object with the reordered items
            const reorderedItems = {};
            reorderedIds.forEach(id => {
              reorderedItems[id] = categoryItems[id];
            });
            
            // Update the category
            updatedCategories[targetCategoryKey] = reorderedItems;
          }
          // Case 2: Moving to a different category
          else {
            // Remove from old category
            const oldCategoryItems = { ...updatedCategories[draggedCategoryKey] };
            delete oldCategoryItems[draggedItemId];
            updatedCategories[draggedCategoryKey] = oldCategoryItems;
  
            // Add to new category at the position of the target item
            const newCategoryItems = { ...updatedCategories[targetCategoryKey] };
            const itemIds = Object.keys(newCategoryItems);
            const targetIndex = itemIds.indexOf(targetItemId);
            
            // Create a new ordered object
            const reorderedItems = {};
            
            // Insert the dragged item at the target position
            let inserted = false;
            itemIds.forEach((id, index) => {
              if (index === targetIndex) {
                // Insert dragged item before target
                reorderedItems[draggedItemId] = draggedItemData;
                inserted = true;
              }
              reorderedItems[id] = newCategoryItems[id];
            });
            
            // If target was last or not found, append to the end
            if (!inserted) {
              reorderedItems[draggedItemId] = draggedItemData;
            }
            
            updatedCategories[targetCategoryKey] = reorderedItems;
          }
  
          const newFormData = {
            ...prev,
            categories: updatedCategories
          };
  
          onChange(newFormData);
          return newFormData;
        });
      } catch (err) {
        console.error("Error processing drag data:", err);
      }
    };
  
    const handleCategoryDragOver = (e, categoryKey) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    };
  
    const handleCategoryDrop = (e, targetCategoryKey) => {
      e.preventDefault();
  
      try {
        const data = JSON.parse(e.dataTransfer.getData("text/plain"));
        const { itemId: draggedItemId, categoryKey: draggedCategoryKey } = data;
  
        // Don't do anything if dropping onto the same category
        if (draggedCategoryKey === targetCategoryKey) return;
  
        setFormData((prev) => {
          // Create a copy of the categories
          const updatedCategories = { ...prev.categories };
  
          // Get the dragged item data
          const draggedItemData = updatedCategories[draggedCategoryKey][draggedItemId];
          if (!draggedItemData) return prev;
  
          // Remove from old category
          const oldCategoryItems = { ...updatedCategories[draggedCategoryKey] };
          delete oldCategoryItems[draggedItemId];
          updatedCategories[draggedCategoryKey] = oldCategoryItems;
  
          // Add to new category at the end
          updatedCategories[targetCategoryKey] = {
            ...updatedCategories[targetCategoryKey],
            [draggedItemId]: draggedItemData
          };
  
          const newFormData = {
            ...prev,
            categories: updatedCategories
          };
  
          onChange(newFormData);
          return newFormData;
        });
      } catch (err) {
        console.error("Error processing drag data:", err);
      }
    };
  
    interface PackageItem {
      name: string;
      price: string;
      action: string;
      image?: string;
      url?: string;
      requiredRank?: string;
    }
  
    type ItemsByCategory = {
      [key: string]: { id: string; data: any }[];
    };
  
    const itemsByCategory: ItemsByCategory = {};
  
    // Organize items by their category
    if (formData.categories) {
      Object.keys(formData.categories).forEach((categoryKey) => {
        // Initialize the category array if it doesn't exist
        if (!itemsByCategory[categoryKey]) {
          itemsByCategory[categoryKey] = [];
        }
  
        // Make sure the category exists in formData.categories before trying to access it
        if (formData.categories[categoryKey]) {
          Object.entries(formData.categories[categoryKey]).forEach(([id, itemData]) => {
            itemsByCategory[categoryKey].push({
              id,
              data: itemData,
            });
          });
        }
      });
    }
  
    // No need to sort - order is preserved by the object key insertion order
  
    const rankItems = [];
  
    // Safely access rank items for the dropdown
    if (formData.categories && typeof formData.categories === "object" && "rank" in formData.categories && formData.categories.rank) {
      Object.entries(formData.categories.rank).forEach(([id, item]) => {
        if (item && typeof item === "object" && "name" in item) {
          rankItems.push({
            value: item.name,
            label: item.name,
          });
        }
      });
    }
  
    return (
      <div>
        {Object.entries(itemsByCategory).map(([categoryKey, categoryItems], categoryIndex) => (
          <div
            key={categoryKey}
            onDragOver={(e) => handleCategoryDragOver(e, categoryKey)}
            onDrop={(e) => handleCategoryDrop(e, categoryKey)}
            className="category-container"
          >
            {/* Category Header */}
            <div
              style={{
                margin: "20px 0 10px 0",
                borderRadius: "5px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span className="form-label !m-[0]">{categoryKey.toUpperCase()}</span>
              <span className="form-label !m-[0]">{categoryItems.length} ITEMS</span>
            </div>
  
            {/* Category Items */}
            {categoryItems.map((item, index) => {
              const { id: itemId, data: itemData } = item;
              const isExpanded = activeIndex === `${categoryKey}-${index}`;
              const imageId = `image-upload-${itemId}`;
              const isRankCategory = categoryKey === "rank";
  
              return (
                <div
                  key={itemId}
                  className={`display-item ${isExpanded ? "expanded" : "collapsed"}`}
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, itemId, categoryKey)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, itemId, categoryKey)}
                  style={{
                    marginBottom: "8px",
                  }}
                >
                  <div className="display-item-header" onClick={() => toggleExpand(`${categoryKey}-${index}`)}>
                    <span>{itemData.name || "New Item"}</span>
                    <div className="item-actions">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveItem(itemId, "up");
                        }}
                        className="move-button"
                        disabled={index === 0}
                      >
                        <FaChevronUp />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveItem(itemId, "down");
                        }}
                        className="move-button"
                        disabled={index === categoryItems.length - 1}
                      >
                        <FaChevronDown />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteItem(itemId);
                        }}
                        className="delete-button"
                      >
                        <FaTrash />
                      </button>
                      <span>{isExpanded ? <FaChevronUp /> : <FaChevronDown />}</span>
                    </div>
                  </div>
                  <div className="display-item-content" style={{ maxHeight: isExpanded ? "800px" : "0" }}>
                    <div className="form-section" style={{ display: "flex", flexDirection: "column", margin: "0 20px 20px" }}>
                      {/* Upload Gambar */}
                      <label className="form-label">IMAGE</label>
                      <div
                        className="upload-box"
                        style={{
                          width: "100px",
                          height: "100px",
                          padding: "60px",
                          border: itemData.url ? "none" : "2px dashed #9f9f9f",
                          borderRadius: "15px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundImage: itemData.url ? `url(${itemData.url})` : "none",
                        }}
                        onClick={() => document.getElementById(imageId)?.click()}
                      >
                        {!itemData.image && (
                          <span style={{ fontSize: "14px", color: "gray" }}>
                            <FaCamera size={40} />
                          </span>
                        )}
                      </div>
                      <input
                        type="file"
                        id={imageId}
                        className="form-input"
                        hidden
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, itemId)}
                        disabled={isUploading}
                      />
                      {isUploading && <p className="mt-[5px] text-sm text-gray-600">Uploading...</p>}
  
                      {/* Input Kategori */}
                      <label className="form-label">CATEGORY</label>
                      <Select
                        options={Object.keys(formData.categories).map((category) => ({
                          value: category,
                          label: category,
                        }))}
                        onChange={(selectedOption) => {
                          if (!selectedOption || !itemId) return;
  
                          setFormData((prev) => {
                            const updatedCategories = { ...prev.categories };
                            
                            const oldCategory = Object.entries(updatedCategories).find(
                              ([_, items]) => Object.keys(items).includes(itemId)
                            )?.[0];
  
                            if (!oldCategory) return prev;
                            const itemData = updatedCategories[oldCategory][itemId];
                            if (!itemData) return prev;
  
                            // Remove from old category
                            const oldCategoryItems = { ...updatedCategories[oldCategory] };
                            delete oldCategoryItems[itemId];
                            updatedCategories[oldCategory] = oldCategoryItems;
  
                            // Add to new category
                            updatedCategories[selectedOption.value] = {
                              ...updatedCategories[selectedOption.value],
                              [itemId]: itemData,
                            };
  
                            const newFormData = {
                              ...prev,
                              categories: updatedCategories
                            };
                            
                            onChange(newFormData);
                            return newFormData;
                          });
                        }}
                        styles={customStyles}
                        placeholder="Select Category"
                        value={
                          itemId
                            ? {
                                value: categoryKey,
                                label: categoryKey,
                              }
                            : null
                        }
                      />
  
                      {/* Nama Package */}
                      <label className="form-label">PACKAGE NAME</label>
                      <input
                        type="text"
                        value={itemData.name}
                        onChange={(e) => handlePackageChange(itemId, "name", e.target.value)}
                        className="form-input"
                        maxLength={32}
                      />
  
                      {/* Required rank */}
                      {isRankCategory && (
                        <>
                          <label className="form-label">REQUIRED RANK</label>
                          <Select
                            options={rankItems}
                            onChange={(selectedOption) => {
                              handlePackageChange(itemId, "requiredRank", selectedOption ? selectedOption.value : null);
                            }}
                            styles={customStyles}
                            placeholder="Select Required Rank"
                            value={itemData.requiredRank ? rankItems.find((option) => option.value === itemData.requiredRank) : null}
                            isClearable
                          />
                        </>
                      )}
  
                      {/* Harga */}
                      <label className="form-label">PRICE</label>
                      <input
                        type="text"
                        value={itemData.price}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          handlePackageChange(itemId, "price", value);
                        }}
                        className="form-input"
                        maxLength={10}
                      />
  
                      {/* Console Command */}
                      <label className="form-label">COMMAND</label>
                      <textarea
                        value={itemData.action}
                        onChange={(e) => handlePackageChange(itemId, "action", e.target.value)}
                        className="form-input form-textarea-action"
                        placeholder="Contoh: money give {user} {price}"
                        rows={4}
                        maxLength={256}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <AddButton text="Add Item" style={{ margin: "10px 0 0" }} onClick={addItem} />
      </div>
    );
  };

  const renderCoinsEditor = (input) => {
    const itemCount = parseInt(formData[input.amount] || 8);
    const defaultQuantities = [5, 10, 20, 50, 80, 100, 140, 200];
    const pricePerCoin = parseInt(formData["price"]) || input.defaultValue || 1000;

    const select = [
      {
        value: "mysql",
        label: "MySQL",
      },
      {
        value: "console",
        label: "Console Command",
        inputs: [
          {
            id: "command",
            label: "Command on Console",
            placeholder: "money add {user} 1000",
          },
        ],
      },
    ];

    return Array.from({ length: itemCount }).map((_, index) => {
      const isExpanded = activeIndex === index;
      const quantity = defaultQuantities[index] || 1;
      const totalPrice = quantity * pricePerCoin;

      if (formData[`${input.id}-quantity-${index}`] === undefined) {
        handleInputChange(`${input.id}-quantity-${index}`, quantity);
      }

      if (formData[`${input.id}-price-${index}`] === undefined) {
        handleInputChange(`${input.id}-price-${index}`, totalPrice);
      }

      if (formData[`${input.id}-action-${index}`] === undefined) {
        handleInputChange(`${input.id}-action-${index}`, "mysql");
      }

      return (
        <div key={`${input.id}-${index}`} id={`${input.id}-${index}`} className={`display-item ${isExpanded ? "expanded" : "collapsed"}`}>
          <div className="display-item-header" onClick={() => toggleExpand(index)}>
            <span>Item {index + 1}</span>
            <span>{isExpanded ? <FaChevronUp /> : <FaChevronDown />}</span>
          </div>
          <div className="display-item-content" style={{ maxHeight: isExpanded ? "800px" : "0" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                margin: "0 20px 20px",
              }}
            >
              <label htmlFor={input.id} className="form-label">
                AMOUNT
              </label>
              <input
                type="text"
                value={formData[`${input.id}-quantity-${index}`]}
                className="form-input"
                maxLength={10}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  handleInputChange(`${input.id}-quantity-${index}`, value === "" ? "" : value);
                }}
              />
              <label htmlFor={input.id} className="form-label">
                PRICE
              </label>
              <input
                type="text"
                value={formData[`${input.id}-price-${index}`]}
                className="form-input"
                maxLength={10}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  handleInputChange(`${input.id}-price-${index}`, value === "" ? "" : value);
                }}
              />
              <label htmlFor={input.id} className="form-label">
                ACTION
              </label>
              <div style={{ maxWidth: "300px", width: "100%" }}>
                <Select
                  options={select}
                  onChange={(selectedOption) => handleInputChange(`${input.id}-action-${index}`, selectedOption.value)}
                  value={select.find((option) => option.value === formData[`${input.id}-action-${index}`]) || null}
                  styles={customStyles}
                  placeholder="Select"
                  menuPlacement="top"
                />
              </div>

              {formData[`${input.id}-action-${index}`] &&
                select
                  .filter((option) => option.value === formData[`${input.id}-action-${index}`])
                  .map((option) => (
                    <div key={option.value}>
                      {option.inputs &&
                        option.inputs.map((subInput) => (
                          <div key={subInput.id} className="form-div">
                            <label htmlFor={subInput.id} className="form-label">
                              {subInput.label.toUpperCase()}
                            </label>
                            <textarea
                              id={subInput.id}
                              placeholder={subInput.placeholder}
                              className="form-input form-textarea-action"
                              value={formData[`${subInput.id}-action-${index}`] || ""}
                              onChange={(e) => handleInputChange(`${subInput.id}-action-${index}`, e.target.value)}
                              rows={input.rows || 4}
                              cols={input.cols || 50}
                              maxLength={256}
                            />
                          </div>
                        ))}
                    </div>
                  ))}
            </div>
          </div>
        </div>
      );
    });
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      setFormData((prev) => {
        const updatedData = {
          ...prev,
          categories: {
            ...prev.categories,
            [newCategoryName]: {},
          },
        };

        onChange(updatedData);
        return updatedData;
      });

      setNewCategoryName("");
      setShowModal(false);
    }
  };

  const handleDeleteCategory = (categoryName) => {
    setFormData((prev) => {
      const categoryKeys = Object.keys(prev.categories);

      if (categoryKeys.length <= 1) return prev;

      const newTargetCategory = categoryKeys.find((key) => key !== categoryName);

      if (!newTargetCategory) return prev;

      const updatedCategories = { ...prev.categories };
      updatedCategories[newTargetCategory] = {
        ...updatedCategories[newTargetCategory],
        ...(updatedCategories[categoryName] || {}),
      };

      delete updatedCategories[categoryName];
      const updatedData = { ...prev, categories: { ...updatedCategories } };

      onChange(updatedData);
      console.log("wkkw", updatedData);
      return updatedData;
    });
  };

  const categoryEditor = () => {
    return (
      <div>
        <div className="bg-[#17181f] max-w-[500px] rounded-[15px]">
          <div className="flex flex-wrap gap-2 p-[20px]">
            {Object.entries(formData.categories).map(([categoryName]) => (
              <div key={categoryName} className="bg-[#272934] py-[10px] px-[20px] rounded-[15px] flex justify-between items-center gap-2">
                <span>{categoryName}</span>
                <button type="button" onClick={() => handleDeleteCategory(categoryName)} className="text-gray-400 text-[15px]">
                  <MdClose />
                </button>
              </div>
            ))}

            <button type="button" onClick={() => setShowModal(true)} className="bg-[#3a3c46] w-[44px] aspect-square rounded-[15px]">
              +
            </button>
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-10">
              <div className="bg-[#1f2129] p-5 rounded-lg w-96">
                <h2 className="text-xl mb-5">Add new Categories</h2>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                  placeholder="name"
                  className="form-input w-full mb-[20px]"
                />
                <div className="flex justify-end gap-[10px]">
                  <ResetButton text="Cancel" onClick={() => setShowModal(false)} />
                  <AddButton text="Save" onClick={handleAddCategory} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const totalHeight = options.reduce((sum, input) => sum + (input.type === "textarea" ? 345 : 100), 0);
  const halfHeight = totalHeight / 2;

  let leftHeight = 0;
  let rightHeight = 0;
  const leftInputs = [];
  const rightInputs = [];
  const centerInputs = [];

  options.forEach((input) => {
    if (`${input.type}`.includes("display")) {
      centerInputs.push(input);
      return;
    } else if (`${input.type}`.includes("button")) {
      centerInputs.push(input);
      return;
    }

    const inputHeight = input.type === "textarea" ? 345 : 100;

    if (leftHeight + inputHeight <= halfHeight || leftHeight <= rightHeight) {
      leftInputs.push(input);
      leftHeight += inputHeight;
    } else {
      rightInputs.push(input);
      rightHeight += inputHeight;
    }
  });

  while (leftHeight < rightHeight) {
    const movedItem = rightInputs.shift();
    if (!movedItem) break;

    leftInputs.push(movedItem);
    leftHeight += movedItem.type === "textarea" ? 345 : 100;
    rightHeight -= movedItem.type === "textarea" ? 345 : 100;
  }

  return (
    <div>
      <form autoComplete="off">
        <div className="form-container">
          <div className="form-left">
            {leftInputs.map((input) => (
              <div key={input.id} className="form-div">
                <label htmlFor={input.id} className="form-label">
                  {input.label.toUpperCase()}
                </label>
                {input.type === "slide" ? (
                  <EditSlider
                    min={input.min || 0}
                    max={input.max || 100}
                    step={input.step || 1}
                    defaultValue={formData[input.id] || input.defaultValue || 0}
                    percentage={input.percentage || false}
                    unit={input.unit}
                    onChange={(value) => handleInputChange(input.id, value)}
                  />
                ) : input.type === "color" ? (
                  <ColorPickerRoot
                    defaultValue={parseColor("#2b2c30")}
                    onValueChangeEnd={(e) => handleInputChange(input.id, e.value.toString("hex"))}
                  >
                    <ColorPickerControl className="form-input form-color" style={{ display: "flex", flexDirection: "row" }}>
                      <ColorPickerInput style={{ outline: "none" }} />
                      <ColorPickerTrigger fitContent rounded="full">
                        <ColorPickerValueSwatch rounded="inherit" style={{ outline: "1px solid #787b88" }} />
                      </ColorPickerTrigger>
                    </ColorPickerControl>
                    <ColorPickerContent>
                      <ColorPickerArea />
                      <HStack>
                        <ColorPickerEyeDropper />
                        <ColorPickerSliders />
                      </HStack>
                    </ColorPickerContent>
                  </ColorPickerRoot>
                ) : input.type === "password" ? (
                  <input
                    type={"text"}
                    id={input.id}
                    placeholder={input.placeholder}
                    className="form-input input-hidden"
                    value={formData[input.id] || ""}
                    onChange={(e) => handleInputChange(input.id, e.target.value)}
                    autoComplete="off"
                    maxLength={64}
                  />
                ) : input.type === "switch" ? (
                  <div className="form-switch">
                    <label className="switch">
                      <input
                        type="checkbox"
                        id={input.id}
                        checked={formData[input.id] || false}
                        onChange={(e) => handleInputChange(input.id, e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                ) : input.type === "textarea" ? (
                  <textarea
                    id={input.id}
                    placeholder={input.placeholder}
                    className="form-input form-textarea"
                    value={formData[input.id] || ""}
                    onChange={(e) => handleInputChange(input.id, e.target.value)}
                    rows={input.rows || 4}
                    cols={input.cols || 50}
                    maxLength={1024}
                  />
                ) : input.type === "select" ? (
                  <Select
                    id={input.id}
                    options={input.choices.map((option) => ({
                      id: option.id,
                      value: option.value,
                      label: option.label,
                    }))}
                    styles={customStyles}
                    placeholder="Select"
                    value={formData[input.id] || ""}
                    onChange={(e) => handleInputChange(input.id, e.target.value)}
                  />
                ) : input.type === "category" ? (
                  <div key={input.id}>
                    <div>{categoryEditor()}</div>
                  </div>
                ) : (
                  <input
                    type={input.type || "text"}
                    id={input.id}
                    placeholder={input.placeholder}
                    className="form-input"
                    value={formData[input.id] || ""}
                    onChange={(e) => handleInputChange(input.id, e.target.value)}
                    autoComplete="off"
                    maxLength={64}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="form-right">
            {rightInputs.map((input) => (
              <div key={input.id} className="form-div">
                <label htmlFor={input.id} className="form-label">
                  {input.label.toUpperCase()}
                </label>
                {input.type === "slide" ? (
                  <EditSlider
                    min={input.min || 0}
                    max={input.max || 100}
                    step={input.step || 1}
                    defaultValue={formData[input.id] || input.defaultValue || 0}
                    percentage={input.percentage || false}
                    unit={input.unit}
                    onChange={(value) => handleInputChange(input.id, value)}
                  />
                ) : input.type === "color" ? (
                  <ColorPickerRoot
                    defaultValue={parseColor("#2b2c30")}
                    onValueChangeEnd={(e) => handleInputChange(input.id, e.value.toString("hex"))}
                  >
                    <ColorPickerControl className="form-input form-color" style={{ display: "flex", flexDirection: "row" }}>
                      <ColorPickerInput style={{ outline: "none" }} />
                      <ColorPickerTrigger fitContent rounded="full">
                        <ColorPickerValueSwatch rounded="inherit" style={{ outline: "1px solid #787b88" }} />
                      </ColorPickerTrigger>
                    </ColorPickerControl>
                    <ColorPickerContent>
                      <ColorPickerArea />
                      <HStack>
                        <ColorPickerEyeDropper />
                        <ColorPickerSliders />
                      </HStack>
                    </ColorPickerContent>
                  </ColorPickerRoot>
                ) : input.type === "password" ? (
                  <input
                    type={"text"}
                    id={input.id}
                    placeholder={input.placeholder}
                    className="form-input input-hidden"
                    value={formData[input.id] || ""}
                    onChange={(e) => handleInputChange(input.id, e.target.value)}
                    autoComplete="off"
                    maxLength={64}
                  />
                ) : input.type === "switch" ? (
                  <div className="form-switch">
                    <label className="switch">
                      <input
                        type="checkbox"
                        id={input.id}
                        checked={formData[input.id] || false}
                        onChange={(e) => handleInputChange(input.id, e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                ) : input.type === "textarea" ? (
                  <textarea
                    id={input.id}
                    placeholder={input.placeholder}
                    className="form-input form-textarea"
                    value={formData[input.id] || ""}
                    onChange={(e) => handleInputChange(input.id, e.target.value)}
                    rows={input.rows || 4}
                    cols={input.cols || 50}
                    maxLength={1024}
                  />
                ) : input.type === "category" ? (
                  <div key={input.id}>
                    <div>{categoryEditor()}</div>
                  </div>
                ) : (
                  <input
                    type={input.type || "text"}
                    id={input.id}
                    placeholder={input.placeholder}
                    className="form-input"
                    value={formData[input.id] || ""}
                    onChange={(e) => handleInputChange(input.id, e.target.value)}
                    autoComplete="off"
                    maxLength={64}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="form-center">
          {centerInputs.map((input) =>
            input.type === "display_coin" ? (
              <div key={input.id} className="display-container" style={{ marginTop: "15px" }}>
                <label htmlFor={input.id} className="form-label">
                  {input.label.toUpperCase()}
                </label>
                <div className="mt-[10px]">{renderCoinsEditor(input)}</div>
              </div>
            ) : input.type === "display_package" ? (
              <div key={input.id} className="display-container" style={{ marginTop: "15px" }}>
                <div className="mt-[10px]">{renderPackageEditor()}</div>
              </div>
            ) : input.type === "button" ? (
              <AddButton key={input.id} text={input.label} style={{ margin: "30px 0 0" }} onClick={() => handleButtonClick(input.action)} />
            ) : null
          )}
        </div>
      </form>
    </div>
  );
}

const EditContainer = ({ children }) => {
  return <div className="edit-container">{children}</div>;
};

const EditTitle = ({ children }) => {
  return <h2 className="edit-title">{children}</h2>;
};

const EditForm = ({ children }) => {
  return <div className="edit-form">{children}</div>;
};

const EditItems = ({ data, onChange }) => {
  return <div>hai</div>;
};

const InputInfo = ({ msg, copy, code = false }: { msg: string; copy: (text: string) => void; code?: boolean }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    copy(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="input-info-container form-input" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <p
        id="input-info"
        style={{
          fontFamily: code ? '"Courier New", monospace' : "inherit",
        }}
      >
        {msg}
      </p>
      <button onClick={() => handleCopy(msg)} className="copy-button">
        {copied ? <TbCopyCheck /> : <TbCopy />}
      </button>
    </div>
  );
};
export { Form, EditContainer, EditTitle, EditForm, EditSlider, EditItems, ConditionalForm, InputInfo };
