const Excel = require('exceljs');

//  { header: 'Index', key: 'Index', width: 10 },
//   { header: 'Name', key: 'name', width: 15 },
//   { header: 'Email', key: 'email', width: 30 },
//   // { header: 'Username', key: 'username', width: 12 },
//   { header: 'Joined', key: 'createdAt', width: 15 },
const exportWishlist = (wishlist, url) => {
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet('wishlists');

  worksheet.columns = [
    { header: 'Index', key: 'Index', width: 10 },
    { header: 'Name', key: 'name', width: 10 },
    { header: 'Email', key: 'email', width: 10 },
    { header: 'Property', key: 'property', width: 10 },
    { header: 'City', key: 'city', width: 10 },
    { header: 'Link', key: 'link', width: 10 },
  ];

  wishlist.forEach((wish, index) => {
    wish.Index = index + 1;
    const { userId, residenceId } = wish;
    wish.name = userId?.name || '';
    (wish.email = userId?.email || ''),
      (wish.property = `${residenceId?.name || ''}/${residenceId?.code || ''}`);
    wish.city = residenceId?.city?.cityName || '';

    wish.link = `${url}/property-detail/${
      residenceId?.city?.cityName || 'in'
    }/${residenceId?.area?.name || 'in'}?code=${wish?.code}`;

    worksheet.addRow(wish);
  });

  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
  });

  return workbook.xlsx;
};

module.exports = {
  exportWishlist,
};
