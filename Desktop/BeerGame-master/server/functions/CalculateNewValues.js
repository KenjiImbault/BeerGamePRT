export default function CalculateNewValues(roleId, role, orderValueByNextRole, delivery, currentRound) {
  let
    newStock = role[currentRound].stock,
    newNextWeek1 = role[currentRound].next1Week,
    newNextWeek2 = role[currentRound].next2Week,
    newDelay = role[currentRound].delay,
    currentOrder = role[currentRound].order,
    deliveryValueToNextRole = 0;

  newStock = newStock + newNextWeek1
  newNextWeek1 = newNextWeek2

  if(roleId === 1) {
    newNextWeek2 = currentOrder
  }
  else {
    newNextWeek2 = delivery
  }

  //If Stock >= Order
  if(newStock >= orderValueByNextRole) {
    newStock = newStock - orderValueByNextRole
    deliveryValueToNextRole = orderValueByNextRole
    if(newDelay > 0) {
      //If Delay - Inventory >= 0
      if((newDelay - newStock) >= 0) {
        newDelay = newDelay - newStock
        deliveryValueToNextRole = deliveryValueToNextRole + newStock
        newStock = 0
      }
      else {
        newStock = newStock - newDelay
        deliveryValueToNextRole = deliveryValueToNextRole + newDelay
        newDelay = 0
      }
    }
  }
  else {
    const diff = orderValueByNextRole - newStock
    deliveryValueToNextRole = newStock
    newStock = 0
    newDelay = newDelay + diff
    
  }

  role[currentRound].stock = newStock
  role[currentRound].next1Week = newNextWeek1
  role[currentRound].next2Week = newNextWeek2
  role[currentRound].delay = newDelay

  return [role, deliveryValueToNextRole]
}
