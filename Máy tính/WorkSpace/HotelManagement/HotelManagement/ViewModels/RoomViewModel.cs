using HotelManagement.ViewModels;
using MaterialDesignThemes.Wpf;
using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Diagnostics.Eventing.Reader;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Documents;
using System.Windows.Ink;
using System.Windows.Input;
using System.Runtime.InteropServices;
using System.Diagnostics;
using HotelManagement.Models;
using System.Security.Policy;
using System.Windows.Interop;
using System.Collections;

namespace HotelManagement.ViewModels
{
    class RoomViewModel : BaseViewModel
    {
        private ObservableCollection<ROOM> _List;
        public ObservableCollection<ROOM> ListRoom { get => _List; set { _List = value; OnPropertyChanged(); } }

        //Selected data of DB
        private ROOM _SelectedItem;
        public ROOM SelectedItem
        {
            get => _SelectedItem;
            set
            {
                _SelectedItem = value;
                OnPropertyChanged();
                if (SelectedItem != null)
                {
                    roomName = SelectedItem.ROOMNAME;
                    roomType = SelectedItem.ROOMTYPEID;
                    roomDescription = SelectedItem.ROOMDESCRIPTION;
                    bedQuantity = SelectedItem.BEDQUANTITY;
                    roomStatus = SelectedItem.STATUS;
                }
            }
        }

        private string _roomName;
        public string roomName { get => _roomName; set { _roomName = value; OnPropertyChanged(); } }

        private int _roomType;
        public int roomType { get => _roomType; set { _roomType = value; OnPropertyChanged(); } }

        //private ObservableCollection<ROOMTYPE> _roomType;
        //public ObservableCollection<ROOMTYPE> roomType { get => _roomType; set { _roomType = value; OnPropertyChanged(); } }

        private string _roomDescription;
        public string roomDescription { get => _roomDescription; set { _roomDescription = value; OnPropertyChanged(); } }

        private int _bedQuantity;
        public int bedQuantity { get => _bedQuantity; set { _bedQuantity = value; OnPropertyChanged(); } }

        private int _roomStatus;
        public int roomStatus { get => _roomStatus; set { _roomStatus = value; OnPropertyChanged(); } }


        public RoomViewModel()
        {

            InitRooms();
        }
        
        
        private void InitRooms()
        {
            ListRoom = new ObservableCollection<ROOM>(DataAdapter.Instance.DB.ROOMs);
        }

    }
}




