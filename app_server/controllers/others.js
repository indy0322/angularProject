/* GET 'about' page. */
const about = (req, res) => {
    res.render('generic-text', {
        title: 'About',
        content: "Loc8r was created to help people find places to sit down \
        and get a bit of work done.<br/><br/>Lorem ipsum dolor sit \
        amet, consectetur adipiscing elit. Nunc sed lorem ac nisi digni \
        ssim accumsan. Nullam sit amet interdum magna. Morbi quis \
        faucibus nisi. Vestibulum mollis purus quis eros adipiscing \
        tristique. Proin posuere semper tellus, id placerat augue dapibus \
        ornare. Aenean leo metus, tempus in nisl eget, accumsan interdum \
        dui. Pellentesque sollicitudin volutpat ullamcorper."
    })
};

module.exports = {
    about
}