using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HotelManagement.Models
{
    class DataAdapter
    {
        private static DataAdapter instance;
        public static DataAdapter Instance
        {
            get
            {
                if (instance == null) instance = new DataAdapter();
                return instance;
            }
            set
            {
                instance = value;
            }
        }
        public HotelManagementEntities DB { get; set; }
        private DataAdapter()
        {
            DB = new HotelManagementEntities();
        }
    }
}


