import React from "react";
import TransactionToastMessages from "./content/TransactionToastMessages";
import { ToastMessage } from "rimble-ui";

class TransactionToastUtil extends React.Component {
  // Determines if collections are same size
  collectionHasNewObject = (prevCollection, currentCollection) => {
    return (
      typeof prevCollection === "undefined" ||
      prevCollection.length !==
        currentCollection.length
    );
  };

  // Returns object from currentCollection that doesn't exist in prevCollection
  getNewObjectFromCollection = (prevCollection, currentCollection) => {
    if (typeof prevCollection !== "undefined") {
      const latestObjects = currentCollection.filter(ckitem => {
        return !prevCollection.some(x=> x.hash === ckitem.hash );
      });
      return latestObjects;
    } else {
      return currentCollection;
    }
  };

  // Compare two collections of objects, return single object from current collection that differs from prev collection
  getUpdatedObjectFromCollection = (prevCollection, currentCollection) => {
    const updatedTransaction = prevCollection
      .map(pk => {
        const curr = currentCollection.find(x=>x.hash === pk.hash);
        if (
          pk.lastUpdated !== curr.lastUpdated
        ) {
          return curr;
        } else {
          return null;
        }
      })
      .filter(object => object !== null);
    return updatedTransaction[0];
  };

  // Returns an transaction from a collection based on a given identifier
  getTransactionFromCollection = (identifier, collection) => {
    const object = collection.find(x=>x.hash === identifier);
    return object;
  };

  // Returns either a new object or finds an updated object in a collection against a previous collection
  getUpdatedTransaction = (prevCollection, currentCollection) => {
    let tx = null;
    let currentTx = {};
    let prevTx = {};

    if (this.collectionHasNewObject(prevCollection, currentCollection)) {
      tx = this.getNewObjectFromCollection(prevCollection, currentCollection);
    } else {
      currentTx = this.getUpdatedObjectFromCollection(
        prevCollection,
        currentCollection
      );
      if (currentTx) {
        prevTx = this.getTransactionFromCollection(
          currentTx.hash,
          prevCollection
        );
      } else {
        return false;
      }

      if (currentTx.status !== prevTx.status) {
        tx = currentTx;
      }
    }
    return tx;
  };

  // Check for updates to the transactions collection
  processTransactionUpdates = prevProps => {
    let tx = null;
    if (this.props.transactions.length) {
      tx = this.getUpdatedTransaction(
        prevProps.transactions,
        this.props.transactions
      );
    }

    if (tx !== null && tx !== false && typeof tx !== "undefined") {
      if(Array.isArray(tx)) {
        tx.forEach(t => {
          this.showTransactionToast(t);
        });
      }else{
        this.showTransactionToast(tx);
      }
    }
  };

  showTransactionToast = transaction => {
    console.log("showTransactionToast: ", { ...transaction });
    // Get text info for toast
    let toastMeta = this.getTransactionToastMeta(transaction);

    // Show toast
    window.toastProvider.addMessage(".", toastMeta);
  };

  getTransactionToastMeta = transaction => {
    let transactionToastMeta = {};
    let status = transaction.status;

    switch (status) {
      case "initialized":
        transactionToastMeta = TransactionToastMessages.initialized;
        break;
      case "started":
        transactionToastMeta = TransactionToastMessages.started;
        break;
      case "pending":
        transactionToastMeta = TransactionToastMessages.pending;
        break;
      case "confirmed":
        transactionToastMeta = TransactionToastMessages.confirmed;
        break;
      case "success":
        transactionToastMeta = TransactionToastMessages.success;
        break;
      case "error":
        transactionToastMeta = TransactionToastMessages.error;
        break;
      default:
        break;
    }

    return transactionToastMeta;
  };

  componentDidUpdate(prevProps, prevState) {
    this.processTransactionUpdates(prevProps);
  }

  render() {
    return (
      <div>
        <ToastMessage.Provider ref={node => (window.toastProvider = node)} />
      </div>
    );
  }
}

export default TransactionToastUtil;
