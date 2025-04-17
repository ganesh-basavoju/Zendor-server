import { Schema, model } from 'mongoose';

const wallpaperSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true
    },
    features: [String],
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative']
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
        trim: true,
        index: true
    },
    subCategory: {
        type: String,
        required: [true, 'Product sub-category is required'],
        trim: true
    },
    stock: {
        type: Number,
        required: [true, 'Stock quantity is required'],
        default: 0,
        min: [0, 'Stock cannot be negative']
    },
    images: [String],
    colors: [String],
    dimensions: { // Stored in Inches 
        width: {
            type: Number,
            // required: [true, 'Width is required'],
            min: [0, 'Width cannot be negative']
        },
        height: {
            type: Number,
            // required: [true, 'Height is required'],
            min: [0, 'Height cannot be negative']
        },
    },
    paparTexture: {
        type: String,
        // required: [true, 'Papar texture is required'],
        enum: ['Feather', 'Canvas', 'Leather', 'Silk'],
    },
    tags: {type: [String], index:true},
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp before saving
wallpaperSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Wallpaper = model('Wallpaper', wallpaperSchema);

export default Wallpaper;