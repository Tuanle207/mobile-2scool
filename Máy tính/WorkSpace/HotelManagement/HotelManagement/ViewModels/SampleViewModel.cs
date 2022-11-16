using HotelManagement.Models;
using HotelManagement.ViewModels;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using DataAdapter = HotelManagement.Models.DataAdapter;

namespace HotelManagement.ViewModels
{
    public class SampleViewModel : BaseViewModel
    {
        // List of USER loaded from database
        private ObservableCollection<USER> usersList;
        // Property for encapsulation
        public ObservableCollection<USER> USERSLIST
        {
            get => usersList;
            set
            {
                usersList = value;
                OnPropertyChanged();
            }
        }

        // Add command to add a new USER to DB
        public ICommand AddCommand;

        /// <summary>
        /// Constructor of class
        /// </summary>
        public SampleViewModel()
        {
            // Retrieve data from DB
            RetrieveData();

            // Define AddCommand
            AddCommand = new AppCommand<object>(
                p => true,
                p =>
                {
                    // Create new USER object
                    var USER = new USER { USERNAME = "admin", PASSWORD = "admin", EMPLOYEENAME = "Nguyễn Xuân Tú" };
                    // Add it to DB context
                    DataAdapter.Instance.DB.USERs.Add(USER);
                    // Save changes to real DB
                    DataAdapter.Instance.DB.SaveChanges();
                });
        }

        /// <summary>
        /// Retrive USERs collection from DB
        /// </summary>
        private void RetrieveData()
        {
            // Load USERs collections from DB
            var List = DataAdapter.Instance.DB.USERs;
            // Create a new instance of ObservableColleion with List as constructor's USER.
            usersList = new ObservableCollection<USER>(List);
        }

    }
}

