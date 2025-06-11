// src/App.js
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import './App.css';
import { db } from './firebase';

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [newQuantity, setNewQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'groceryItems'), (snapshot) => {
      const itemsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(itemsList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addItem = async (e) => {
    e.preventDefault();
    if (newItem.trim() === '') return;

    try {
      await addDoc(collection(db, 'groceryItems'), {
        name: newItem.trim(),
        quantity: parseInt(newQuantity),
        completed: false,
        createdAt: new Date()
      });
      setNewItem('');
      setNewQuantity(1);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, 'groceryItems', id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const toggleCompleted = async (id, completed) => {
    try {
      await updateDoc(doc(db, 'groceryItems', id), {
        completed: !completed
      });
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const updateQuantity = async (id, quantity) => {
    try {
      await updateDoc(doc(db, 'groceryItems', id), {
        quantity: parseInt(quantity)
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading HZ & PF's grocery list...</div>;
  }

  return (
    <div className="App">
      {/* Floating fruit decorations */}
      <div className="fruit-decoration apple">🍎</div>
      <div className="fruit-decoration banana">🍌</div>
      <div className="fruit-decoration orange">🍊</div>
      <div className="fruit-decoration grape">🍇</div>
      <div className="fruit-decoration carrot">🥕</div>
      <div className="fruit-decoration tomato">🍅</div>
      <div className="fruit-decoration lettuce">🥬</div>
      <div className="fruit-decoration strawberry">🍓</div>
      <div className="fruit-decoration cheese">🧀</div>
      
      <header className="App-header">
        <h1>🛒 HZ and PF's Grocery List</h1>
        
        <form onSubmit={addItem} className="add-item-form">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Enter grocery item..."
            className="item-input"
          />
          <input
            type="number"
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
            min="1"
            className="quantity-input"
          />
          <button type="submit" className="add-button">Add Item</button>
        </form>

        <div className="grocery-list">
          {items.length === 0 ? (
            <p className="empty-state">No items in HZ and PF's grocery list yet!</p>
          ) : (
            items.map(item => (
              <div key={item.id} className={`grocery-item ${item.completed ? 'completed' : ''}`}>
                <div className="item-content">
                  <input type="checkbox" checked={item.completed} onChange={() => toggleCompleted(item.id, item.completed)} className="checkbox"/>
                  <span className="item-name">{item.name}</span>
                  <input type="number" value={item.quantity} onChange={(e) => updateQuantity(item.id, e.target.value)} min="1" className="quantity-display"/>
                  <button onClick={() => deleteItem(item.id)} className="delete-button">✕</button>
                </div>
              </div>
            ))
          )}
        </div>
      </header>
    </div>
  );
}

export default App;