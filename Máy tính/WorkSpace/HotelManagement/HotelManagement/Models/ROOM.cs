//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace HotelManagement.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class ROOM
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public ROOM()
        {
            this.BOOKINGROOMs = new HashSet<BOOKINGROOM>();
        }
    
        public int ROOMID { get; set; }
        public int ROOMTYPEID { get; set; }
        public string ROOMNAME { get; set; }
        public string ROOMDESCRIPTION { get; set; }
        public int BEDQUANTITY { get; set; }
        public int STATUS { get; set; }
        public Nullable<System.DateTime> CREATEDDATE { get; set; }
        public string CREATEDUSER { get; set; }
        public int ISDELETED { get; set; }
        public string DELETEDUSER { get; set; }
        public Nullable<System.DateTime> DELETEDDATE { get; set; }
        public Nullable<System.DateTime> UPDATEDDATE { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<BOOKINGROOM> BOOKINGROOMs { get; set; }
        public virtual ROOMTYPE ROOMTYPE { get; set; }
    }
}
