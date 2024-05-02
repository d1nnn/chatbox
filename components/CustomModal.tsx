import React, { useState } from "react";
import { Modal, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

type CustomModal = {
  confirmText: string,
  visibility: boolean,
  handleModal: () => void,
}

export default function CustomModal({ confirmText, visibility, handleModal }: CustomModal): React.JSX.Element {

  return (
    // <Modal
    //   transparent={true}
    //   visible={true}
    // >
    //   <View style={{ backgroundColor: '#777', flex: 1 }}>
    //     <View style={{ backgroundColor: 'blue' }}>
    //       <Text>
    //         {confirmText}
    //       </Text>
    //
    //       <View style={{ flexDirection: 'row', gap: 20, justifyContent: 'center', alignItems: 'center' }}>
    //         <TouchableOpacity onPress={() => handleModal()}>
    //           <Text style={{ padding: 10, borderRadius: 5, fontSize: 18, backgroundColor: 'peachpuff' }}>
    //             Confirm
    //           </Text>
    //         </TouchableOpacity>
    //         <TouchableOpacity onPress={() => handleModal()}>
    //           <Text style={{ padding: 10, borderRadius: 5, fontSize: 18, backgroundColor: 'red' }}>
    //             Cancel
    //           </Text>
    //         </TouchableOpacity>
    //       </View>
    //     </View>
    //   </View>
    // </Modal>

    
  )
}
